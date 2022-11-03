/// <reference types="react-scripts" />

interface Product {
  id: number;
  name: string;
  categoryId: number;
}

export interface Category {
  id: number,
  title: string,
  icon: string,
  ownerId: number,
}

export interface User {
  id: number;
  name: string;
  sex: string;
}

export interface ProductComplete extends Product {
  user: User | null;
  category: Category | null;
}
