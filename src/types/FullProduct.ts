import { Category } from './Category';
import { User } from './User';

export interface FullProduct {
  id: number;
  name: string;
  category: Category | null;
  user: User | null;
}
