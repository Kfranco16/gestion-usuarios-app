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

  createUser(user: Omit<IUser, '_id'>): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl, user);
  }

  updateUser(_id: string, user: Partial<Omit<IUser, '_id'>>): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/${_id}`, user);
  }

  deleteUser(_id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${_id}`);
  }
}
