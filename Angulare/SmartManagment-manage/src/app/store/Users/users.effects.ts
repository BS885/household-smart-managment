import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UsersActions from './users.actions';
import { catchError, defer, map, mergeMap, of, tap } from 'rxjs';
import { UsersService } from '../../services/users.service';

@Injectable()
export class UsersEffects {
  constructor(private actions$: Actions, private usersService: UsersService) { }

  loadUsers$ = createEffect(() =>
    defer(() =>
      this.actions$.pipe(
        ofType(UsersActions.loadUsers),
        tap(() => console.log('Effect triggered')),
        mergeMap(() =>
          this.usersService.getUsers().pipe(
            map((users) => UsersActions.loadUsersSuccess({ users })),
            catchError((error) => of(UsersActions.loadUsersFailure({ error: error.message })))
          )
        )
      )
    )
  );

  addUser$ = createEffect(() =>
    defer(() =>
      this.actions$.pipe(
        ofType(UsersActions.addUser),
        mergeMap(({ user }) =>
          this.usersService.addUser(user).pipe(
            map((createdUser) => UsersActions.addUserSuccess({ user: createdUser })),
            catchError((error) =>
              of(UsersActions.addUserFailure({ error: error.message }))
            )
          )
        )
      )
    )
  );

  changeRole$ = createEffect(() =>
    defer(() =>
      this.actions$.pipe(
        ofType(UsersActions.changeRole),
        mergeMap(({ id, roleName }) =>
          this.usersService.changeRole({ id, roleName }).pipe(
            map((updatedUser) =>
              UsersActions.changeRoleSuccess({ user: updatedUser })
            ),
            catchError((error) =>
              of(UsersActions.changeRoleFailure({ error: error.message }))
            )
          )
        )
      )
    )
  );

  refreshUsers$ = createEffect(() =>
    defer(() =>
      this.actions$.pipe(
        ofType(
          UsersActions.changeRoleSuccess,
          UsersActions.addUserSuccess,
        ),
        map(() => UsersActions.loadUsers())
      )
    )
  );
}