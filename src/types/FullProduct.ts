import { Category } from './Category';
import { Product } from './Product';
import { User } from './User';

export interface FullProduct extends Product {
  user: User | null,
  category: Category | null,
}
