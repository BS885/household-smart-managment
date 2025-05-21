import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, defer, map, mergeMap, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthEffects {


  login$ = createEffect(() =>
    defer(() =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        mergeMap(({ email, password }) =>
          this.authService.login(email, password).pipe(
            map((response) => AuthActions.loginSuccess({ user: response.userLogin })),
            catchError((error) => of(AuthActions.loginFailure({ error: error.message })))
          )
        )
      )
    )
  );

  constructor(private actions$: Actions, private authService: AuthService) {
    console.log('actions$', this.actions$); // ← האם זה undefined?
  }
}
