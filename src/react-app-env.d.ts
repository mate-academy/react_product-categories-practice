/// <reference types="react-scripts" />

export interface User {
  id: number,
  name: string,
  sex: string,
}

export interface Category {
  id: number,
  title: string,
  icon: string,
  ownerId: number,
}

export interface Product {
  id: number,
  name: string,
  categoryId: number,
}

export interface ProductWithCategory extends Product {
  category: Category | null,
  user: User | null,
}
