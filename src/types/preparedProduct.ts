import { Product } from './product';
import { Category } from './categorie';
import { User } from './user';

export interface PreparedProduct extends Product {
  category: Category,
  user: User,
}
