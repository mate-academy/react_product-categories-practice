import { Category } from './category';

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  category: Category | null;
}
