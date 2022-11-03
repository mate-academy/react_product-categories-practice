import { Owner } from './Owner';

export interface Category {
  id?: number | undefined,
  title?: string | undefined,
  icon?: string | undefined,
  ownerId?: number | undefined,
  owner?: Owner | null,
}
