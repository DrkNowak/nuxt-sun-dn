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

  console.log(rows[0]);

  return [];
}
