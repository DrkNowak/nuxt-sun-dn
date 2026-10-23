const getFilterValue = (query: Record<string, unknown>, key: string) => {
  return typeof query[key] === 'string' ? query[key] : null;
};

const getNumberFilter = (query: Record<string, unknown>, key: string): number | null => {
  const value = getFilterValue(query, key);

  if (value === null || value.trim() === '') {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid filter: ${key}`,
    });
  }

  return number;
};

const compareNullable = (a: number | null, b: number | null): number => {
  if (a === null) return b === null ? 0 : 1;
  if (b === null) return -1;

  return a - b;
};

export default defineEventHandler((event) => {
  const products = getProducts();
  const query = getQuery(event);

  const category = getFilterValue(query, 'category');
  const manufacturer = getFilterValue(query, 'manufacturer');
  const search = getFilterValue(query, 'search')?.trim().toLowerCase();
  const sort = getFilterValue(query, 'sort');

  const minPrice = getNumberFilter(query, 'minPrice');
  const maxPrice = getNumberFilter(query, 'maxPrice');

  const minCapacity = getNumberFilter(query, 'minCapacity');
  const maxCapacity = getNumberFilter(query, 'maxCapacity');

  const minPower = getNumberFilter(query, 'minPower');
  const maxPower = getNumberFilter(query, 'maxPower');

  const isInvalidRange = (min: number | null, max: number | null) =>
    min !== null && max !== null && min > max;

  if (
    isInvalidRange(minPrice, maxPrice) ||
    isInvalidRange(minCapacity, maxCapacity) ||
    isInvalidRange(minPower, maxPower)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid filter range',
    });
  }

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !category || product.category === category;

    const matchesManufacturer = !manufacturer || product.manufacturer === manufacturer;

    const matchesMinCapacity =
      minCapacity === null ||
      (product.capacityKwh !== null && product.capacityKwh >= minCapacity);

    const matchesMaxCapacity =
      maxCapacity === null ||
      (product.capacityKwh !== null && product.capacityKwh <= maxCapacity);

    const matchesMinPower =
      minPower === null || (product.powerW !== null && product.powerW >= minPower);

    const matchesMaxPower =
      maxPower === null || (product.powerW !== null && product.powerW <= maxPower);

    const matchesMinPrice = minPrice === null || product.price >= minPrice;

    const matchesMaxPrice = maxPrice === null || product.price <= maxPrice;

    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.manufacturer.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search);

    return (
      matchesCategory &&
      matchesManufacturer &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesSearch &&
      matchesMinCapacity &&
      matchesMaxCapacity &&
      matchesMinPower &&
      matchesMaxPower
    );
  });

  switch (sort) {
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;

    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;

    case 'name-asc':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case 'name-desc':
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;

    case 'capacity-asc':
      filteredProducts.sort((a, b) => compareNullable(a.capacityKwh, b.capacityKwh));
      break;

    case 'capacity-desc':
      filteredProducts.sort((a, b) => compareNullable(b.capacityKwh, a.capacityKwh));
      break;

    case 'power-asc':
      filteredProducts.sort((a, b) => compareNullable(a.powerW, b.powerW));
      break;

    case 'power-desc':
      filteredProducts.sort((a, b) => compareNullable(b.powerW, a.powerW));
      break;
  }

  return filteredProducts;
});
