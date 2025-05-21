import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PermissionState } from '../../store/Permission/permissions.reducer';

export const selectPermissionState = createFeatureSelector<PermissionState>('permissions');

export const selectAllPermissions = createSelector(
  selectPermissionState,
  state => state.permissions
);

export const selectPermissionLoading = createSelector(
  selectPermissionState,
  state => state.loading
);
