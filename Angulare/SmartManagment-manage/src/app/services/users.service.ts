import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User, UserWithPassword } from '../models/User.model';
import * as UsersActions from '../store/Users/users.actions';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) { }

  getUsers(): Observable<User[]> {
    return this.http.get<{ $id: string; $values: any[] }>(this.apiUrl + '/user').pipe(
      map(response => {
        return response.$values.map(user => ({
          ...user,
          role: user.roles?.$values?.includes('Admin') ? 'Admin' : (user.roles?.$values?.[0] || 'לא מוגדר')
        }));
      })
    );
  }

  addUser(user: UserWithPassword): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/auth/register/Manager', user);
  }

  changeRole({ id, roleName }: { id: number, roleName: string }): Observable<User> {
    return this.http.put<User>(this.apiUrl + `/user/${id}/role`, { roleName });
  }
}