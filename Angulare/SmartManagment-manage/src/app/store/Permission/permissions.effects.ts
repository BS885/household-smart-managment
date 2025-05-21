import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PermissionActions from '../../store/Permission/permissions.actions';
import { Permission } from '../../models/Permission.model';
import { catchError, map, mergeMap, of } from 'rxjs';
import { PermissionService } from '../../services/permissions.service';

@Injectable()
export class PermissionEffects {
  constructor(private actions$: Actions, private service: PermissionService) {}

  loadPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PermissionActions.loadPermissions),
      mergeMap(() =>
        this.service.getAll().pipe(
          map(permissions => PermissionActions.loadPermissionsSuccess({ permissions })),
          catchError(error => of(PermissionActions.loadPermissionsFailure({ error })))
        )
      )
    )
  );

  addPermission$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PermissionActions.addPermission),
      mergeMap(action =>
        this.service.add(action.permission).pipe(
          map(permission => PermissionActions.addPermissionSuccess({ permission })),
          catchError(error => of(PermissionActions.addPermissionFailure({ error })))
        )
      )
    )
  );

  deletePermission$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PermissionActions.deletePermission),
      mergeMap(action =>
        this.service.delete(action.id).pipe(
          map(() => PermissionActions.deletePermissionSuccess({ id: action.id })),
          catchError(error => of(PermissionActions.deletePermissionFailure({ error })))
        )
      )
    )
  );
}
