import { createAction, props } from '@ngrx/store';
import { Category, CategoryPost, CategoryPut } from '../../models/Category.model';

export const loadCategories = createAction('[Categories] Load Categories');

export const loadCategoriesSuccess = createAction(
  '[Categories] Load Categories Success',
  props<{ categories: Category[] }>()
);

export const loadCategoriesFailure = createAction(
  '[Categories] Load Categories Failure',
  props<{ error: string }>()
);

export const setCategories = createAction(
  '[Categories] Set Categories',
  props<{ categories: Category[] }>()
);

export const addCategory = createAction(
  '[Categories] Add Category',
  props<{ category: CategoryPost }>()
);

export const addCategorySuccess = createAction(
  '[Categories] Add Category Success',
  props<{ category: Category }>()
);

export const addCategoryFailure = createAction(
  '[Categories] Add Category Failure',
  props<{ error: string }>()
);

export const updateCategory = createAction(
  '[Categories] Update Category',
  props<{ category: CategoryPut }>()
);

export const updateCategorySuccess = createAction(
  '[Categories] Update Category Success',
  props<{ category: Category }>()
);

export const updateCategoryFailure = createAction(
  '[Categories] Update Category Failure',
  props<{ error: string }>()
);