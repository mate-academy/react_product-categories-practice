import { Category } from './Category';
import { User } from './User';

export interface FullCategory extends Category {
  user: User | null,
}
