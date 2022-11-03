import { Category } from './Category';
import { Product } from './Product';
import { User } from './User';

export interface FullInfo extends Product {
  category: Category | null;
  user: User | null;
}
