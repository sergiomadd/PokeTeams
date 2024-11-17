import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "../types/auth.state";

const selectAuth = createFeatureSelector<AuthState>('auth');
export const selectToken = createSelector(selectAuth, (auth) => auth.token);
export const selectUser = createSelector(selectAuth, (auth) => auth.user);
export const selectIsSubmitting = createSelector(selectAuth, (auth) => auth.isSubmitting);
export const selectValidationErrors = createSelector(selectAuth, (auth) => auth.errors);