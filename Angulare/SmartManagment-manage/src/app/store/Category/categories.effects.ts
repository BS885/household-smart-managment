import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CategoriesActions from './categories.actions';
import { catchError, defer, map, mergeMap, of } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';

@Injectable()
export class CategoriesEffects {
  constructor(private actions$: Actions, private categoriesService: CategoriesService) { }

  loadCategories$ = createEffect(() =>
    defer(() =>
      this.actions$.pipe(
        ofType(CategoriesActions.loadCategories),
        mergeMap(() =>
          this.categoriesService.getCategories().pipe(
            map((categories) => CategoriesActions.loadCategoriesSuccess({ categories })),
            catchError((error) => of(CategoriesActions.loadCategoriesFailure({ error: error.message })))
          )
        )
      )
    )
  );

  addCategory$ = createEffect(() =>
    defer(() =>
      this.actions$.pipe(
        ofType(CategoriesActions.addCategory),
        mergeMap(({ category }) =>
          this.categoriesService.addCategory(category).pipe(
            map((createdCategory) => CategoriesActions.addCategorySuccess({ category: createdCategory })),
            catchError((error) => of(CategoriesActions.addCategoryFailure({ error: error.message })))
          )
        )
      )
    )
  );

  updateCategory$ = createEffect(() =>
    defer(() =>
      this.actions$.pipe(
        ofType(CategoriesActions.updateCategory),
        mergeMap(({ category }) =>
          this.categoriesService.updateCategory(category).pipe(
            map((updatedCategory) => CategoriesActions.updateCategorySuccess({ category: updatedCategory })),
            catchError((error) => of(CategoriesActions.updateCategoryFailure({ error: error.message })))
          )
        )
      )
    )
  );

  refreshUsers$ = createEffect(() =>
      defer(() =>
        this.actions$.pipe(
          ofType(
            CategoriesActions.addCategorySuccess,
            CategoriesActions.updateCategorySuccess
          ),
          map(() => CategoriesActions.loadCategories())
        )
      )
    );
}
