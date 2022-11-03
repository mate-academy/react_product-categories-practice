import { Product } from './Product';
import { Category } from './Category';
import { User } from './User';

export interface ExtendProduct extends Product {
  category: Category | null,
  user: User | null,
}
