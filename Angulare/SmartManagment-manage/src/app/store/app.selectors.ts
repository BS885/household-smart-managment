import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "./app.state";

export const selectAppState = createFeatureSelector<AppState>('app');

export const selectUser = createSelector(selectAppState, (state) => state.auth.user);
export const selectUsers = createSelector(selectAppState, (state) => state.users);
export const selectCategories = createSelector(selectAppState, (state) => state.categories);
export const selectPermissions = createSelector(selectAppState, (state) => state.permissions);
