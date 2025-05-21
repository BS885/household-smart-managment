import { createAction, props } from '@ngrx/store';
import { Permission } from '../../models/Permission.model';

export const loadPermissions = createAction('[Permission] Load All');
export const loadPermissionsSuccess = createAction('[Permission] Load Success', props<{ permissions: Permission[] }>());
export const loadPermissionsFailure = createAction('[Permission] Load Failure', props<{ error: any }>());

export const addPermission = createAction('[Permission] Add', props<{ permission: Partial<Permission> }>());
export const addPermissionSuccess = createAction('[Permission] Add Success', props<{ permission: Permission }>());
export const addPermissionFailure = createAction('[Permission] Add Failure', props<{ error: any }>());

export const deletePermission = createAction('[Permission] Delete', props<{ id: number }>());
export const deletePermissionSuccess = createAction('[Permission] Delete Success', props<{ id: number }>());
export const deletePermissionFailure = createAction('[Permission] Delete Failure', props<{ error: any }>());
