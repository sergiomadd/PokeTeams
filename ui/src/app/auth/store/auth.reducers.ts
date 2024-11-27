
import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from 'src/app/auth/types/auth.state';
import { authActions } from './auth.actions';

export const authReducers = createReducer(
  initialAuthState,
  on(authActions.refresh, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null,
      success: false
    })),
  on(authActions.refreshSuccess, (state, action) => (
    {
      ...state,
      user: action.authResponse.user,
      accessToken: action.authResponse.accessToken,
      refreshToken: action.authResponse.refreshToken,
      isAuthenticated: true,
      isSubmitting: false,
      success: true
    })),
  on(authActions.refreshFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      accessToken: null,
      refreshToken: null,
      user: null,
      error: action.error
    })),
  on(authActions.getLogged, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null,
      success: false
    })),
  on(authActions.getLoggedSuccess, (state, action) => (
    {
      ...state,
      user: action.authResponse.user,
      accessToken: action.authResponse.accessToken,
      refreshToken: action.authResponse.refreshToken,
      isAuthenticated: true,
      isSubmitting: false,
      success: true
    })),
  on(authActions.getLoggedFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      user: null,
      error: action.error
    })),
  on(authActions.logIn, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null,
      success: false
    })),
  on(authActions.logInSuccess, (state, action) => (
    {
      ...state,
      accessToken: action.authResponse.accessToken,
      refreshToken: action.authResponse.refreshToken,
      user: action.authResponse.user,
      isAuthenticated: true,
      isSubmitting: false,
      success: true
    })),
  on(authActions.logInFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      error: action.error
    })),
  on(authActions.signUp, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null,
      success: false
    })),
  on(authActions.signUpSuccess, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      success: true,
      user: action.authResponse.user,
      accessToken: action.authResponse.accessToken,
      refreshToken: action.authResponse.refreshToken,
      isAuthenticated: true,
    })),
  on(authActions.signUpFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      error: action.error
    })),
  on(authActions.logOut, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null,
      success: false
    })),
  on(authActions.logOutSuccess, (state) => (
    {
      ...state,
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isSubmitting: false,
      success: true
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
      error: null,
      success: false
    })),
  on(authActions.deleteAccountSuccess, (state) => (
    {
      ...state,
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isSubmitting: false,
      success: true
    })),
  on(authActions.deleteAccountFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      error: action.error
    })),
  on(authActions.changeName, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null,
      success: false
    })),
  on(authActions.changeNameSuccess, (state, action) => (
    {
      ...state,
      accessToken: action.authResponse.accessToken,
      refreshToken: action.authResponse.refreshToken,
      user: action.authResponse.user,
      isSubmitting: false,
      success: true
    })),
  on(authActions.changeNameFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      error: action.error
    })),
  on(authActions.changeUserName, (state) => (
    {
      ...state,
      isSubmitting: true,
      error: null,
      success: false
    })),
  on(authActions.changeUserNameSuccess, (state, action) => (
    {
      ...state,
      accessToken: action.authResponse.accessToken,
      refreshToken: action.authResponse.refreshToken,
      user: action.authResponse.user,
      isSubmitting: false,
      success: true
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
      error: null,
      success: false
    })),
  on(authActions.changeEmailSuccess, (state, action) => (
    {
      ...state,
      accessToken: action.authResponse.accessToken,
      refreshToken: action.authResponse.refreshToken,
      user: action.authResponse.user,
      isSubmitting: false,
      success: true
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
      error: null,
      success: false
    })),
  on(authActions.changePasswordSuccess, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      success: true
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
      error: null,
      success: false
    })),
  on(authActions.changePictureSuccess, (state, action) => (
    {
      ...state,
      accessToken: action.authResponse.accessToken,
      refreshToken: action.authResponse.refreshToken,
      user: action.authResponse.user,
      isSubmitting: false,
      success: true
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
      error: null,
      success: false
    })),
  on(authActions.changeCountrySuccess, (state, action) => (
    {
      ...state,
      accessToken: action.authResponse.accessToken,
      refreshToken: action.authResponse.refreshToken,
      user: action.authResponse.user,
      isSubmitting: false,
      success: true
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
      error: null,
      success: false
    })),
  on(authActions.changeVisibilitySuccess, (state, action) => (
    {
      ...state,
      accessToken: action.authResponse.accessToken,
      refreshToken: action.authResponse.refreshToken,
      user: action.authResponse.user,
      isSubmitting: false,
      success: true
    })),
  on(authActions.changeVisibilityFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      error: action.error
    })),
)