// import { createAction, props } from '@ngrx/store';
// import { User } from '../models/User.model';
// import { Category } from '../models/Category.model';
// import { Permission } from '../models/Permission.model';

import { createAction, props } from "@ngrx/store";


// export const setUser = createAction('[App] Set User', props<{ user: User | null }>());
// export const setUsers = createAction('[App] Set Users', props<{ users: User[] }>());
// export const setCategories = createAction('[App] Set Categories', props<{ categories: Category[] }>());
// export const setPermissions = createAction('[App] Set Permissions', props<{ permissions: Permission[] }>());
// export const setLoading = createAction('[App] Set Loading', props<{ loading: boolean }>());
// export const setError = createAction('[App] Set Error', props<{ error: string | null }>());

// export const loadUsers = createAction('[App/API] Load Users');
// export const loadUsersSuccess = createAction('[App/API] Load Users Success', props<{ users: User[] }>());
// export const loadUsersFailure = createAction('[App/API] Load Users Failure', props<{ error: string }>());

export const setLoading = createAction('[App] Set Loading', props<{ loading: boolean }>());
export const setError = createAction('[App] Set Error', props<{ error: string | null }>());