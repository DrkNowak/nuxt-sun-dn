const getFilterValue = (query: Record<string, unknown>, key: string) => {
  return typeof query[key] === 'string' ? query[key] : null;
};

export default defineEventHandler((event) => {
  const products = getProducts();
  const query = getQuery(event);

  const category = getFilterValue(query, 'category');
  const manufacturer = getFilterValue(query, 'manufacturer');
  const search = getFilterValue(query, 'search')?.trim().toLowerCase();
  const sort = getFilterValue(query, 'sort');

  const minCapacity = getFilterValue(query, 'minCapacity');
  const maxCapacity = getFilterValue(query, 'maxCapacity');
  const minPower = getFilterValue(query, 'minPower');
  const maxPower = getFilterValue(query, 'maxPower');

  const rawMinPrice = getFilterValue(query, 'minPrice');
  const rawMaxPrice = getFilterValue(query, 'maxPrice');

  const minPrice = rawMinPrice?.trim() ? Number(rawMinPrice) : null;
  const maxPrice = rawMaxPrice?.trim() ? Number(rawMaxPrice) : null;

  const isInvalidMinPrice =
    minPrice !== null && (!Number.isFinite(minPrice) || minPrice < 0);

  const isInvalidMaxPrice =
    maxPrice !== null && (!Number.isFinite(maxPrice) || maxPrice < 0);

  const isInvalidRange = minPrice !== null && maxPrice !== null && minPrice > maxPrice;

  if (isInvalidMinPrice || isInvalidMaxPrice || isInvalidRange) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid price filter',
    });
  }

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !category || product.category === category;

    const matchesManufacturer = !manufacturer || product.manufacturer === manufacturer;

    const matchesMinCapacity =
      !minCapacity ||
      (product.capacityKwh !== null && product.capacityKwh >= Number(minCapacity));

    const matchesMaxCapacity =
      !maxCapacity ||
      (product.capacityKwh !== null && product.capacityKwh <= Number(maxCapacity));

    const matchesMinPower =
      !minPower || (product.powerW !== null && product.powerW >= Number(minPower));

    const matchesMaxPower =
      !maxPower || (product.powerW !== null && product.powerW <= Number(maxPower));

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
      filteredProducts.sort(
        (a, b) => (a.capacityKwh ?? Infinity) - (b.capacityKwh ?? Infinity),
      );
      break;

    case 'capacity-desc':
      filteredProducts.sort(
        (a, b) => (b.capacityKwh ?? -Infinity) - (a.capacityKwh ?? -Infinity),
      );
      break;

    case 'power-asc':
      filteredProducts.sort((a, b) => (a.powerW ?? Infinity) - (b.powerW ?? Infinity));
      break;

    case 'power-desc':
      filteredProducts.sort((a, b) => (b.powerW ?? -Infinity) - (a.powerW ?? -Infinity));
      break;
  }

  return filteredProducts;
});
