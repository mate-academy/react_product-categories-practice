import { Category } from './category';
import { User } from './user';

export interface Product {
  id: number,
  name: string,
  categoryId: number,
  user: User | null,
  category: Category | null,
}
