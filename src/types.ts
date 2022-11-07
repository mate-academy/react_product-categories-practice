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

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  user: User | null;
  category: Category | null;
}

export enum SortField {
  ID = 'id',
  Product = 'product',
  Category = 'category',
  User = 'user',
  None = 'none',
}
