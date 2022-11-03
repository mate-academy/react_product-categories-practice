import { Category } from './Category';
import { Product } from './Product';
import { User } from './User';

export interface Good extends Product {
  categorie: Category | undefined,
  owner: User | undefined,
}
