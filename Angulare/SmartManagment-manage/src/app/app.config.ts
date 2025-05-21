import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { routes } from './app.routes';
import { usersReducer } from './store/Users/users.reducer';
import { UsersEffects } from './store/Users/users.effects';
import { authInterceptor } from './services/auth.interceptor';
import { categoriesReducer } from './store/Category/categories.reducer';
import { CategoriesEffects } from './store/Category/categories.effects';
import { permissionReducer } from './store/Permission/permissions.reducer';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideEffects([UsersEffects,CategoriesEffects]),
    provideStore({ users: usersReducer,
      categories: categoriesReducer,
      permissions: permissionReducer ,
     })
  ]
};
