import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "../types/auth.state";

const selectAuth = createFeatureSelector<AuthState>('auth');
export const selectAccessToken = createSelector(selectAuth, (auth) => auth.accessToken);
export const selectUsername = createSelector(selectAuth, (auth) => auth.username);
export const selectIsSubmitting = createSelector(selectAuth, (auth) => auth.isSubmitting);
export const selectError = createSelector(selectAuth, (auth) => auth.error);
export const selectSuccess = createSelector(selectAuth, (auth) => auth.success);