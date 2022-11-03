export interface Product {
  id: number;
  name: string;
  categoryId: number;
  user: User | undefined;
  category: Category | undefined;
}

export interface User {
  id: number;
  name: string;
  sex: string;
}

export interface Category {
  id: number;
  title: string;
  icon: string;
  ownerId: number;
}
