import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from './Auth/auth.reducer';
import { categoriesReducer } from './Category/categories.reducer';
import { permissionsReducer } from './Permission/permissions.reducer';
import { usersReducer } from './Users/users.reducer';



export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  users: usersReducer,
  categories: categoriesReducer,
  permissions: permissionsReducer
};
