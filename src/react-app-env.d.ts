/// <reference types="react-scripts" />

export interface Product {
  id: number,
  name: string,
  categoryId: number,
  user: User | null,
  category: Category | null,
}

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

export interface FullProduct extends Product {
  user: User | null,
  category: Category | null,
}
