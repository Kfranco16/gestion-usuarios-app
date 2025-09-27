import { IUser } from './iuser.interface';
export interface Iresponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  results: IUser[]; // El array de usuarios
}
