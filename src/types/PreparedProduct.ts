import { Category } from './categorie';
import { Product } from './product';
import { User } from './user';

export interface PreparedProduct extends Product {
  category: Category | null;
  user: User | null;
}
