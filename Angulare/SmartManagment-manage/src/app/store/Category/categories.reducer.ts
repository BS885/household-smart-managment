import { createReducer, on } from '@ngrx/store';
import * as CategoriesActions from './categories.actions';
import { Category } from '../../models/Category.model';

export interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  addSuccess: boolean;
  updateSuccess: boolean;
}


export const initialCategoriesState: CategoriesState = {
  categories: [],
  error: null,
  loading: false,
  addSuccess: false,
  updateSuccess: false
};

export const categoriesReducer = createReducer(
  initialCategoriesState,

  on(CategoriesActions.loadCategories, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CategoriesActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    loading: false,
    error: null
  })),

  on(CategoriesActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(CategoriesActions.addCategory, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CategoriesActions.addCategorySuccess, (state, { category }) => ({
    ...state,
    categories: [...state.categories, category],
    loading: false,
    error: null,
    addSuccess: true,
    
  })),

  on(CategoriesActions.addCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    addSuccess: false
  })),

  on(CategoriesActions.updateCategory, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CategoriesActions.updateCategorySuccess, (state, { category }) => ({
    ...state,
    categories: state.categories.map(c => c.id === category.id ? category : c),
    loading: false,
    error: null,
    updateSuccess: true
  })),

  on(CategoriesActions.updateCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    updateSuccess: false
  }))
);
