import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "../types/auth.state";

const selectAuth = createFeatureSelector<AuthState>('auth');
export const selectToken = createSelector(selectAuth, (auth) => auth.accessToken);
export const selectUser = createSelector(selectAuth, (auth) => auth.user);
export const selectIsSubmitting = createSelector(selectAuth, (auth) => auth.isSubmitting);
export const selectError = createSelector(selectAuth, (auth) => auth.error);
export const selectSuccess = createSelector(selectAuth, (auth) => auth.success);