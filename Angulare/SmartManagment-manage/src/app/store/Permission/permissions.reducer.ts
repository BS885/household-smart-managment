import { createReducer, on } from '@ngrx/store';
import * as PermissionActions from '../../store/Permission/permissions.actions';
import { Permission } from '../../models/Permission.model';

export interface PermissionState {
  permissions: Permission[];
  loading: boolean;
  error: any;
}

export const initialState: PermissionState = {
  permissions: [],
  loading: false,
  error: null
};

export const permissionReducer = createReducer(
  initialState,

  on(PermissionActions.loadPermissions, state => ({ ...state, loading: true })),
  on(PermissionActions.loadPermissionsSuccess, (state, { permissions }) => ({ ...state, loading: false, permissions })),
  on(PermissionActions.loadPermissionsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PermissionActions.addPermissionSuccess, (state, { permission }) => ({
    ...state,
    permissions: [...state.permissions, permission]
  })),

  on(PermissionActions.deletePermissionSuccess, (state, { id }) => ({
    ...state,
    permissions: state.permissions.filter(p => p.id !== id)
  }))
);
