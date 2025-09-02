import { createAction, props } from "@ngrx/store";

export const setLoading = createAction('[App] Set Loading', props<{ loading: boolean }>());
export const setError = createAction('[App] Set Error', props<{ error: string | null }>());