import { AuthState } from "./Auth/auth.reducer";
import { CategoriesState } from "./Category/categories.reducer";
import { UsersState } from "./Users/users.reducer";


export interface AppState {
  auth: AuthState;
  users: UsersState;
  categories: CategoriesState;
  permissions: PermissionState;
}
