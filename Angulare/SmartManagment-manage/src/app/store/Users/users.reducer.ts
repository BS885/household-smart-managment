import { createReducer, on } from '@ngrx/store';
import * as UsersActions from './users.actions';
import { User } from '../../models/User.model';

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const initialUsersState: UsersState = {
  users: [],
  loading: false,
  error: null
};

export const usersReducer = createReducer(
  initialUsersState,
  on(UsersActions.loadUsers, (state) => ({ ...state, loading: true })),
  // on(UsersActions.loadUsersSuccess, (state, { users }) => ({
  //    ...state, users, loading: false })),

  on(UsersActions.loadUsersSuccess, (state, { users }) => {
    console.log('Users loaded:', users);
    return { ...state, users, loading: false };
  }),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(UsersActions.addUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
    loading: false
  })),
  on(UsersActions.addUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(UsersActions.addUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UsersActions.changeRole, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.changeRoleSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    loading: false,
  })),

  on(UsersActions.changeRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
