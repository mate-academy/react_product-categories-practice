import { FullCategory } from './FullCategory';

export interface Product {
  id: number,
  name: string,
  categoryId: number,
}

export interface FullProduct extends Product {
  category: FullCategory | null,
}
