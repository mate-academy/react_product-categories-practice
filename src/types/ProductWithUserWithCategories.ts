import { User } from './user';
import { Product } from './product';
import { Categories } from './categories';

export interface ProductWithUserWithCategories extends Product {
  user: User | undefined;
  categories: Categories | undefined;
}
