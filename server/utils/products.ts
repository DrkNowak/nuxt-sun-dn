import { readFileSync } from 'node:fs';
import { parse } from 'csv-parse/sync';
import type { Product } from '#shared/types/products';
import { parseSpecifications } from './specifications';

let cachedProducts: Product[] | null = null;

export async function getProducts(): Promise<Product[]> {
  if (cachedProducts) {
    return cachedProducts;
  }

  const csv = await useStorage('assets:server').getItem<string>('products.csv');

  if (csv === null) {
    throw new Error('Products CSV not found');
  }

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

    const { capacityKwh, powerW } = parseSpecifications(description);

    return {
      id: String(index + 1),
      name,
      manufacturer,
      description,
      category: category as Product['category'],
      price,
      capacityKwh,
      powerW,
    };
  });

  return cachedProducts;
}
