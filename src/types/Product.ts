import { Category } from './Category';

export interface Product {
  id: number,
  name: string,
  categoryId: number,
  category: Category | null,
}
