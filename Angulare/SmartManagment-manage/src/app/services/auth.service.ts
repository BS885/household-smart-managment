// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
// import { TokenService } from './token.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private currentUserSubject: BehaviorSubject<any>;
//   public currentUser: Observable<any>;
//   private apiUrl = "https://localhost:7084/api";
//   constructor(private http: HttpClient,
//     private router: Router,
//     private tokenService: TokenService) {
//     this.currentUserSubject = new BehaviorSubject<any>(this.getUserFromToken());
//     this.currentUser = this.currentUserSubject.asObservable();
//   }
//   public get currentUserValue(): any {
//     return this.currentUserSubject.value;
//   }

//   login(email: string, password: string): Observable<any> {
//     console.log(`${this.apiUrl}/Auth/login`, { email, password });
  
//     return this.http.post<any>(`${this.apiUrl}/Auth/login`, { email, password }).pipe(
//       tap(response => {
//         const user = response?.userLogin;  
  
//         // Check if user is admin
  
//         if (!this.isAdmin(user)) {
//           throw new Error('אין הרשאה - רק מנהל יכול להתחבר');
//         }
  
//         // Store token and user only if admin
//         if (user?.token) {
//           this.tokenService.setToken(user.token);
//           this.currentUserSubject.next(user);
//         }
  
//         return response;
//       }),
//       catchError(error => {
//         console.error('Login error:', error);
//         return throwError(() => error);
//       })
//     );
//   }
  

//   logout(): void {
//     // Remove token and user info
//     this.tokenService.removeToken();
//     this.currentUserSubject.next(null);
//     this.router.navigate(['/auth/login']);
//   }

//   isLoggedIn(): boolean {
//     return this.tokenService.getToken() !== null;
//   }

//   isAdmin(user: any): boolean {
//     console.log("isAdmin", user && user.roles.$values[0].toLowerCase() === 'admin');
//     return user && user.roles.$values[0].toLowerCase() === 'admin';
//   }

//   private getUserFromToken(): any {
//     const token = this.tokenService.getToken();
//     if (token) {
//       try {
//         // Get user data from token
//         return this.tokenService.decodeToken(token);
//       } catch (error) {
//         console.error('Error decoding token', error);
//         return null;
//       }
//     }
//     return null;
//   }

//   // For development without backend
//   devLogin(username: string, password: string): Observable<any> {
//     // Simulate API response
//     if (username === 'admin' && password === 'admin123') {
//       const mockResponse = {
//         token: 'mock_token_for_admin',
//         user: {
//           id: 1,
//           username: 'admin',
//           role: 'admin'
//         }
//       };

//       this.tokenService.setToken(mockResponse.token);
//       this.currentUserSubject.next(mockResponse.user);

//       return new Observable(observer => {
//         observer.next(mockResponse);
//         observer.complete();
//       });
//     } else {
//       return throwError(() => new Error('Invalid credentials'));
//     }
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, catchError, throwError, of, tap } from 'rxjs';
import { TokenService } from './token.service';
import * as AuthActions from '../store/Auth/auth.actions'; // פעולות ה-NgRx
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private apiUrl = environment.apiUrl+ '/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private store: Store // הוספת ה-Store
  ) {
    // ניהול currentUser בתוך ה-Service
    this.currentUserSubject = new BehaviorSubject<any>(this.getUserFromToken());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    console.log(`${this.apiUrl}/login`, { email, password });

    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      catchError((error) => {
        console.error('Login error:', error);
        this.store.dispatch(AuthActions.loginFailure({ error: error.message })); // Dispatch loginFailure במקרה של שגיאה
        return throwError(() => error);
      }),
      tap((response) => {
        const user = response?.userLogin;

        // בדיקת הרשאות - רק משתמש מסוג Admin
        if (!this.isAdmin(user)) {
          throw new Error('אין הרשאה - רק מנהל יכול להתחבר');
        }

        if (user?.token) {
          this.tokenService.setToken(user.token);
          this.currentUserSubject.next(user);

          // שליחה לפעולה של loginSuccess
          this.store.dispatch(AuthActions.loginSuccess({ user }));
        }
        return response;
      })
    );
  }

  logout(): void {
    // הסרת טוקן ומידע על המשתמש
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);

    // Dispatch של logout
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


