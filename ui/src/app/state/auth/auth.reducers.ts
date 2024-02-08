
import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthStateInterface } from 'src/app/models/authState.interface';
import { authActions } from './auth.actions';

export const initialState: AuthStateInterface = 
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
      on(authActions.signUp, state => (
        {
          ...state,
          isSubmitting: true,
          validationErrors: null
        })),
      on(authActions.signUpSuccess, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          currentUser: action.response
        })),
      on(authActions.signUpFailure, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          validationErrors: action.errors
        })),
      on(authActions.logIn, state => (
        {
          ...state,
          isSubmitting: true,
          validationErrors: null
        })),
      on(authActions.logInSuccess, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          currentUser: action.response
        })),
      on(authActions.logInFailure, (state, action) => (
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