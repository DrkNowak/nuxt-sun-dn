export default defineEventHandler(async () => {
  const products = await getProducts();

  return [...new Set(products.map((product) => product.manufacturer))].sort((a, b) =>
    a.localeCompare(b),
  );
});
