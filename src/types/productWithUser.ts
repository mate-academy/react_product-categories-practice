import { User } from './user';
import { Category } from './Category';

export interface ProductWithUser {
  id: number,
  name: string,
  categoryId: number,
  category?: Category,
  user?: User,
}
