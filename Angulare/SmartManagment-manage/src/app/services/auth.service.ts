import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, catchError, throwError, of, tap } from 'rxjs';
import { TokenService } from './token.service';
import * as AuthActions from '../store/Auth/auth.actions';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject$: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  
  private apiUrl = environment.apiUrl + '/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private store: Store 
  ) {
    this.currentUserSubject$ = new BehaviorSubject<any>(this.getUserFromToken());
    this.currentUser = this.currentUserSubject$.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject$.value;
  }

  login(email: string, password: string): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      catchError((error) => {
        console.error('Login error:', error);
        this.store.dispatch(AuthActions.loginFailure({ error: error.message })); 
        return throwError(() => error);
      }),
      tap((response) => {
        const user = response?.userLogin;

        if (!this.isAdmin(user)) {
          throw new Error('אין הרשאה - רק מנהל יכול להתחבר');
        }

        if (user?.token) {
          this.tokenService.setToken(user.token);
          this.currentUserSubject$.next(user);

          this.store.dispatch(AuthActions.loginSuccess({ user }));
        }
        return response;
      })
    );
  }

  logout(): void {
    
    this.tokenService.removeToken();
    this.currentUserSubject$.next(null);

    this.store.dispatch(AuthActions.logout());

    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }

  isAdmin(user: any): boolean {
    return user && user.roles.$values[0].toLowerCase() === 'admin';
  }

  private getUserFromToken(): any {
    const token = this.tokenService.getToken();
    if (token) {
      try {
        return this.tokenService.decodeToken(token);
      } catch (error) {
        console.error('Error decoding token', error);
        return null;
      }
    }
    return null;
  }
}


