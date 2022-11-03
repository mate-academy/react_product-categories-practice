import { Category } from './Categorie';
import { Product } from './Product';
import { User } from './User';

export interface PreparedProduct extends Product {
  category: Category | null;
  user: User | null;
}
