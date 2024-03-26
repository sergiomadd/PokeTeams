
import { createReducer, on } from '@ngrx/store';
import { AuthState } from 'src/app/auth/types/auth.state';
import { authActions } from './auth.actions';

export const initialAuthState: AuthState = 
{
  isSubmitting: false,
  loggedUser: undefined,
  validationErrors: null
};


export const authReducers = createReducer(
  initialAuthState,
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
  on(authActions.changeUserName, (state) => (
    {
      ...state,
      isSubmitting: true,
      validationErrors: null
    })),
  on(authActions.changeUserNameSuccess, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      loggedUser: action.response.user
    })),
  on(authActions.changeUserNameFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      validationErrors: action.errors
    })),
  on(authActions.changeEmail, (state) => (
    {
      ...state,
      isSubmitting: true,
      validationErrors: null
    })),
  on(authActions.changeEmailSuccess, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      loggedUser: action.response.user
    })),
  on(authActions.changeEmailFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      validationErrors: action.errors
    })),
  on(authActions.changePassword, (state) => (
    {
      ...state,
      isSubmitting: true,
      validationErrors: null
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
      validationErrors: action.errors
    })),
  on(authActions.changePicture, (state) => (
    {
      ...state,
      isSubmitting: true,
      validationErrors: null
    })),
  on(authActions.changePictureSuccess, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      loggedUser: action.response.user
    })),
  on(authActions.changePictureFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      validationErrors: action.errors
    })),
  on(authActions.changeCountry, (state) => (
    {
      ...state,
      isSubmitting: true,
      validationErrors: null
    })),
  on(authActions.changeCountrySuccess, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      loggedUser: action.response.user
    })),
  on(authActions.changeCountryFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      validationErrors: action.errors
    })),
  on(authActions.changeVisibility, (state) => (
    {
      ...state,
      isSubmitting: true,
      validationErrors: null
    })),
  on(authActions.changeVisibilitySuccess, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      loggedUser: action.response.user
    })),
  on(authActions.changeVisibilityFailure, (state, action) => (
    {
      ...state,
      isSubmitting: false,
      validationErrors: action.errors
    })),
)
/*
export const signUpReducer = createReducer(initialAuthState,
  on(authActions.signUp, (state) => ({ ...state, isSubmitting: true, validationErrors: null})),
  on(authActions.signUpSuccess, (state, action) => ({ ...state, isSubmitting: false, loggedUser: action.response.user })),
  on(authActions.signUpFailure, (state, action) => ({ ...state, isSubmitting: false, validationErrors: action.errors }))
  )

export const logInReducer = createReducer(initialAuthState,
  on(authActions.logIn, (state) => ({ ...state, isSubmitting: true, validationErrors: null})),
  on(authActions.logInSuccess, (state, action) => ({ ...state, isSubmitting: false, loggedUser: action.response.user })),
  on(authActions.logInFailure, (state, action) => ({ ...state, isSubmitting: false, validationErrors: action.errors }))
  )

export const getLoggedReducer = createReducer(initialAuthState,
  on(authActions.getLogged, (state) => ({ ...state, isSubmitting: true, validationErrors: null})),
  on(authActions.getLoggedSuccess, (state, action) => ({ ...state, isSubmitting: false, loggedUser: action.response.user })),
  on(authActions.getLoggedFailure, (state, action) => ({ ...state, isSubmitting: false, loggedUser: null, validationErrors: action.errors }))
  )

export const logOutReducer = createReducer(initialAuthState,
  on(authActions.logOut, (state) => ({ ...state, isSubmitting: true, validationErrors: null})),
  on(authActions.logOutSuccess, (state) => ({ ...state, isSubmitting: false, loggedUser: null })),
  on(authActions.logOutFailure, (state, action) => ({ ...state, isSubmitting: false, validationErrors: action.errors }))
  )

export const deleteAccountReducer = createReducer(initialAuthState,
  on(authActions.deleteAccount, (state) => ({ ...state, isSubmitting: true, validationErrors: null})),
  on(authActions.deleteAccountSuccess, (state) => ({ ...state, isSubmitting: false, loggedUser: null })),
  on(authActions.deleteAccountFailure, (state, action) => ({ ...state, isSubmitting: false, validationErrors: action.errors }))
  )
  
export const changeUserNameReducer = createReducer(initialAuthState,
  on(authActions.changeUserName, (state) => ({ ...state, isSubmitting: true, validationErrors: null})),
  on(authActions.changeUserNameSuccess, (state, action) => ({ ...state, isSubmitting: false, loggedUser: action.response.user })),
  on(authActions.changeCountryFailure, (state, action) => ({ ...state, isSubmitting: false, validationErrors: action.errors }))
  )

export const changeEmailReducer = createReducer(initialAuthState,
  on(authActions.changeEmail, (state) => ({ ...state, isSubmitting: true, validationErrors: null})),
  on(authActions.changeEmailSuccess, (state, action) => ({ ...state, isSubmitting: false, loggedUser: action.response.user })),
  on(authActions.changeEmailFailure, (state, action) => ({ ...state, isSubmitting: false, validationErrors: action.errors }))
  )

export const changePasswordReducer = createReducer(initialAuthState,
  on(authActions.changePassword, (state) => ({ ...state, isSubmitting: true, validationErrors: null})),
  on(authActions.changePasswordSuccess, (state, action) => ({ ...state, isSubmitting: false })),
  on(authActions.changePasswordFailure, (state, action) => ({ ...state, isSubmitting: false, validationErrors: action.errors }))
  )

export const changePictureReducer = createReducer(initialAuthState,
  on(authActions.changePicture, (state) => ({ ...state, isSubmitting: true, validationErrors: null})),
  on(authActions.changePictureSuccess, (state, action) => ({ ...state, isSubmitting: false, loggedUser: action.response.user })),
  on(authActions.changePictureFailure, (state, action) => ({ ...state, isSubmitting: false, validationErrors: action.errors }))
  )

export const changeCountryReducer = createReducer(initialAuthState,
  on(authActions.changeCountry, (state) => ({ ...state, isSubmitting: true, validationErrors: null})),
  on(authActions.changeCountrySuccess, (state, action) => ({ ...state, isSubmitting: false, loggedUser: action.response.user })),
  on(authActions.changeCountryFailure, (state, action) => ({ ...state, isSubmitting: false, validationErrors: action.errors }))
  )

export const changeVisibilityReducer = createReducer(initialAuthState,
  on(authActions.changeVisibility, (state) => ({ ...state, isSubmitting: true, validationErrors: null})),
  on(authActions.changeVisibilitySuccess, (state, action) => ({ ...state, isSubmitting: false, loggedUser: action.response.user })),
  on(authActions.changeVisibilityFailure, (state, action) => ({ ...state, isSubmitting: false, validationErrors: action.errors }))
  )

export const authReducers = 
[
  signUpReducer,
  logInReducer,
  getLoggedReducer,
  logOutReducer,
]

*/

/*
export const authFeature = createFeature(
  {
    name: 'auth',
    reducer: createReducer(
      initialAuthState,
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
      on(authActions.changeUserName, (state) => (
        {
          ...state,
          isSubmitting: true,
          validationErrors: null
        })),
      on(authActions.changeUserNameSuccess, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          loggedUser: action.response.user
        })),
      on(authActions.changeUserNameFailure, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          validationErrors: action.errors
        })),
      on(authActions.changeEmail, (state) => (
        {
          ...state,
          isSubmitting: true,
          validationErrors: null
        })),
      on(authActions.changeEmailSuccess, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          loggedUser: action.response.user
        })),
      on(authActions.changeEmailFailure, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          validationErrors: action.errors
        })),
      on(authActions.changePassword, (state) => (
        {
          ...state,
          isSubmitting: true,
          validationErrors: null
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
          validationErrors: action.errors
        })),
      on(authActions.changePicture, (state) => (
        {
          ...state,
          isSubmitting: true,
          validationErrors: null
        })),
      on(authActions.changePictureSuccess, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          loggedUser: action.response.user
        })),
      on(authActions.changePictureFailure, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          validationErrors: action.errors
        })),
      on(authActions.changeCountry, (state) => (
        {
          ...state,
          isSubmitting: true,
          validationErrors: null
        })),
      on(authActions.changeCountrySuccess, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          loggedUser: action.response.user
        })),
      on(authActions.changeCountryFailure, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          validationErrors: action.errors
        })),
      on(authActions.changeVisibility, (state) => (
        {
          ...state,
          isSubmitting: true,
          validationErrors: null
        })),
      on(authActions.changeVisibilitySuccess, (state, action) => (
        {
          ...state,
          isSubmitting: false,
          loggedUser: action.response.user
        })),
      on(authActions.changeVisibilityFailure, (state, action) => (
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
*/