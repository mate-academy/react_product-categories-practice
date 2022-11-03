import { Category } from "./Category";
import { User } from "./User";

export interface productsWithCategorieAndUser {
  id: number,
  name: string,
  categoryId: number,
  category: Category | undefined,
  user: User | undefined,
}