export default defineEventHandler(() => {
  const products = getProducts();

  return [...new Set(products.map((product) => product.manufacturer))].sort((a, b) =>
    a.localeCompare(b),
  );
});
