let cachedProducts: Product[] | null = null;

export function getProducts(): Product[] {
  if (cachedProducts !== null) {
    return cachedProducts;
  }

  // Tutaj odczytamy CSV i zmapujemy rekordy.
  cachedProducts = loadProductsFromCsv();

  return cachedProducts;
}
