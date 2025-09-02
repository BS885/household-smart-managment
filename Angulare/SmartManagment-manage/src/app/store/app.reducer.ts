import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from './Auth/auth.reducer';
import { categoriesReducer } from './Category/categories.reducer';
import { usersReducer } from './Users/users.reducer';
import { permissionReducer } from './Permission/permissions.reducer';



export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  users: usersReducer,
  categories: categoriesReducer,
  permissions: permissionReducer
};
