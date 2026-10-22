export type ProductCategory = 'battery' | 'solar panel' | 'connector';

export interface Product {
  id: string;
  name: string;
  manufacturer: string;
  description: string;
  category: ProductCategory;
  price: number;
  capacityKwh: number | null;
  powerW: number | null;
}
