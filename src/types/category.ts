import { User } from './user';

export interface Category {
  id: number;
  title: string;
  icon: string;
  ownerId: number;
  user: User | null;
}
