
import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from 'src/app/auth/types/auth.state';
import { authActions } from './auth.actions';

export const authReducers = createReducer(
  initialAuthState,
  on(authActions.signUp, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null
    })),
  on(authActions.signUpSuccess, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      user: action.authResponse.user,
      token: action.authResponse.token,
      isAuthenticated: true,
    })),
  on(authActions.signUpFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      error: action.error
    })),
  on(authActions.logIn, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null
    })),
  on(authActions.logInSuccess, (state, action) => (
    {
      ...state,
      user: action.authResponse.user,
      token: action.authResponse.token,
      isAuthenticated: true,
      isSubmitting: false,
    })),
  on(authActions.logInFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      error: action.error
    })),
  on(authActions.getLogged, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null
    })),
  on(authActions.getLoggedSuccess, (state, action) => (
    {
      ...state,
      user: action.authResponse.user,
      token: action.authResponse.token,
      isAuthenticated: true,
      isSubmitting: false
    })),
  on(authActions.getLoggedFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      token: null,
      user: null,
      error: action.error
    })),
  on(authActions.logOut, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null
    })),
  on(authActions.logOutSuccess, (state) => (
    {
      ...state,
      token: null,
      user: null,
      isSubmitting: false,
    })),
  on(authActions.logOutFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      error: action.error
    })),
  on(authActions.deleteAccount, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null
    })),
  on(authActions.deleteAccountSuccess, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      user: null
    })),
  on(authActions.deleteAccountFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      error: action.error
    })),
  on(authActions.changeUserName, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null
    })),
  on(authActions.changeUserNameSuccess, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      user: action.response.user
    })),
  on(authActions.changeUserNameFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      error: action.error
    })),
  on(authActions.changeEmail, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null
    })),
  on(authActions.changeEmailSuccess, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      user: action.response.user
    })),
  on(authActions.changeEmailFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      error: action.error
    })),
  on(authActions.changePassword, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null
    })),
  on(authActions.changePasswordSuccess, (state, action) => (
    {
      ...state,
      isSubmitting: false,
    })),
  on(authActions.changePasswordFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      error: action.error
    })),
  on(authActions.changePicture, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null
    })),
  on(authActions.changePictureSuccess, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      user: action.response.user
    })),
  on(authActions.changePictureFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      error: action.error
    })),
  on(authActions.changeCountry, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null
    })),
  on(authActions.changeCountrySuccess, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      user: action.response.user
    })),
  on(authActions.changeCountryFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      error: action.error
    })),
  on(authActions.changeVisibility, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null
    })),
  on(authActions.changeVisibilitySuccess, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      user: action.response.user
    })),
  on(authActions.changeVisibilityFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      error: action.error
    })),
)