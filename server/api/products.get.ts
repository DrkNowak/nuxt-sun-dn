const getFilterValue = (query: Record<string, unknown>, key: string) => {
  return typeof query[key] === 'string' ? query[key] : null;
};

export default defineEventHandler((event) => {
  const products = getProducts();
  const query = getQuery(event);

  const category = getFilterValue(query, 'category');
  const manufacturer = getFilterValue(query, 'manufacturer');
  const search = getFilterValue(query, 'search')?.trim().toLowerCase();

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

  return products.filter((product) => {
    const matchesCategory = !category || product.category === category;

    const matchesManufacturer = !manufacturer || product.manufacturer === manufacturer;

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
      matchesSearch
    );
  });
});
