export interface FullList {
  id: number | null;
  name: string | null;
  categoryId: number | null;
  title: string | null;
  icon: string | null;
  userName: string | null;
  sex: string | null;
}

export interface Users {
  id: number,
  name: string,
  sex: string,
}

export interface Catigories {
  id: number,
  title: string,
  icon: string,
  ownerId: number,
}
