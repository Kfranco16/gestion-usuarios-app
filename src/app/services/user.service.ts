import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/iuser.interface';
import { Observable, map } from 'rxjs';
import { Iresponse } from '../interfaces/iresponse.interface';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://peticiones.online/api/users';

  getUsers(page: number): Observable<Iresponse> {
    const options = { params: { page: page.toString() } };
    return this.http.get<Iresponse>(this.apiUrl, options);
  }
  getUserById(_id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/${_id}`);
  }

  // C - CREATE: Crear un nuevo usuario
  // (Recibe un usuario sin ID y la API debería devolver el usuario completo con ID)
  createUser(user: Omit<IUser, '_id'>): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl, user);
  }

  // U - UPDATE: Actualizar un usuario existente
  updateUser(_id: string, user: Partial<Omit<IUser, '_id'>>): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/${_id}`, user);
  }

  // D - DELETE: Eliminar un usuario
  deleteUser(_id: string): Observable<any> {
    // La respuesta de un delete suele ser vacía o un objeto de éxito, por eso usamos 'any'
    return this.http.delete<any>(`${this.apiUrl}/${_id}`);
  }
}
