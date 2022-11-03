/// <reference types="react-scripts" />
export interface User {
  id: number,
  name: string,
  sex: string,
}

export interface Product {
  id: number,
  name: string,
  categoryId: number,
}

export interface Categories {
  id: number,
  title: string,
  icon: string,
  ownerId: number,
}

export interface FullProduct {
  id: number,
  name: string,
  categoryId: number,
  user: User | null,
  cattegories: Categories | null,
}
