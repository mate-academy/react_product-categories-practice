export interface User {
  id: number;
  name: string;
  sex: string;
}

export interface Product {
  id: number;
  name: string;
  categoryId: number;
}

export interface Category {
  id: number;
  title: string;
  icon: string;
  ownerId: number;
}

export interface ProductWithCategory extends Product {
  user: User | null;
  category: Category | null;
}
