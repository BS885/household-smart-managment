import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoriesState } from './categories.reducer';

export const selectCategoriesState = createFeatureSelector<CategoriesState>('categories');

export const selectCategories = createSelector(
  selectCategoriesState,
  (state) => state.categories
);

export const selectCategoriesLoading = createSelector(
  selectCategoriesState,
  (state) => state.loading
);

export const selectCategoriesError = createSelector(
  selectCategoriesState,
  (state) => state.error
);

// ✅ הצלחה בהוספה
export const selectAddSuccess = createSelector(
  selectCategoriesState,
  (state) => state.addSuccess
);

// ✅ הצלחה בעדכון
export const selectUpdateSuccess = createSelector(
  selectCategoriesState,
  (state) => state.updateSuccess
);

// ✅ שגיאה כללית
export const selectError = createSelector(
  selectCategoriesState,
  (state) => state.error
);
