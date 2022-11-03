import { Category } from './category';
import { User } from './user';
import { Product } from './product';

export interface FullProduct extends Product {
  category: Category | null;
  user: User | null;
}
