import { Categories } from './Categories';
import { Products } from './Products';
import { Users } from './Users';

export interface TotalProduct extends Products {
  user?: Users
  category?: Categories
}
