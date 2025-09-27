import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/iuser.interface';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://peticiones.online/api/users';

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl);
  }

  // R - READ: Obtener un solo usuario por su ID
  getUserById(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/${id}`);
  }

  // C - CREATE: Crear un nuevo usuario
  // (Recibe un usuario sin ID y la API debería devolver el usuario completo con ID)
  createUser(user: Omit<IUser, 'id'>): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl, user);
  }

  // U - UPDATE: Actualizar un usuario existente
  updateUser(id: number, user: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/${id}`, user);
  }

  // D - DELETE: Eliminar un usuario
  deleteUser(id: number): Observable<any> {
    // La respuesta de un delete suele ser vacía o un objeto de éxito, por eso usamos 'any'
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

}
