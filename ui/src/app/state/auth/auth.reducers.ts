
import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthState } from 'src/app/state/auth/auth.state';
import { authActions } from './auth.actions';

export const initialState: AuthState = 
{
  isSubmitting: false,
  loggedUser: undefined,
  validationErrors: null
};

const authFeature = createFeature(
  {
    name: 'auth',
    reducer: createReducer(
      initialState,
      on(authActions.signUp, (state) => (
        {
          ...state,
          isSubmitting: true,
          validationErrors: null
        })),
      on(authActions.signUpSuccess, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          loggedUser: action.response.user
        })),
      on(authActions.signUpFailure, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          validationErrors: action.errors
        })),
      on(authActions.logIn, (state) => (
        {
          ...state,
          isSubmitting: true,
          validationErrors: null
        })),
      on(authActions.logInSuccess, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          loggedUser: action.response.user
        })),
      on(authActions.logInFailure, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          validationErrors: action.errors
        })),
      on(authActions.getLogged, (state) => (
        {
          ...state,
          isSubmitting: true,
          validationErrors: null
        })),
      on(authActions.getLoggedSuccess, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          loggedUser: action.response.user
        })),
      on(authActions.getLoggedFailure, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          loggedUser: null,
          validationErrors: action.errors
        })),
      on(authActions.logOut, (state) => (
        {
          ...state,
          isSubmitting: true,
          validationErrors: null
        })),
      on(authActions.logOutSuccess, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          loggedUser: null
        })),
      on(authActions.logOutFailure, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          validationErrors: action.errors
        })),
      on(authActions.deleteAccount, (state) => (
        {
          ...state,
          isSubmitting: true,
          validationErrors: null
        })),
      on(authActions.deleteAccountSuccess, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          loggedUser: null
        })),
      on(authActions.deleteAccountFailure, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          validationErrors: action.errors
        })),
    )
  }
);

export const 
{
  name: authFeatureKey,
  reducer: authReducer,
  selectIsSubmitting,
  selectLoggedUser,
  selectValidationErrors  
} = authFeature;