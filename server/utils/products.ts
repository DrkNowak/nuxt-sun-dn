import { readFileSync } from 'node:fs';
import { parse } from 'csv-parse/sync';
import type { Product } from '#shared/types/products';

let cachedProducts: Product[] | null = null;

export function getProducts(): Product[] {
  if (cachedProducts) {
    return cachedProducts;
  }

  const csv = readFileSync('server/data/products.csv', 'utf-8');

  const rows: Record<string, string>[] = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
  });

  cachedProducts = rows.map((row, index): Product => {
    const { name, manufacturer, description, category } = row;
    const rawPrice = row.price;

    if (!name || !manufacturer || !description || !category || !rawPrice) {
      throw new Error(`Missing fields at row ${index + 2}`);
    }

    if (!['battery', 'solar panel', 'connector'].includes(category)) {
      throw new Error(`Invalid category at row ${index + 2}`);
    }

    const price = Number(rawPrice);

    if (!Number.isFinite(price) || price < 0) {
      throw new Error(`Invalid price at row ${index + 2}`);
    }

    return {
      id: String(index + 1),
      name,
      manufacturer,
      description,
      category: category as Product['category'],
      price,
      capacityKwh: null,
      powerW: null,
    };
  });

  return cachedProducts;
}
