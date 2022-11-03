import { Category } from './Category';
import { User } from './User';

export interface ComplexProduct {
  id: number;
  name: string;
  categoryId: number;
  category: Category | undefined;
  user: User | undefined;
}
