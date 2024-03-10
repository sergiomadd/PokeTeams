import { Inject, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "src/app/services/user.service";
import { authActions } from "./auth.actions";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { User } from "../../models/user.model"
import { AuthResponseDTO } from "src/app/models/DTOs/authResponse.dto";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

export const getLogged = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService)
  ) =>
  {
    return actions$.pipe(
      ofType(authActions.getLogged),
      switchMap(() =>
      {
        return authService.getLogged().pipe(
          map((response: AuthResponseDTO) =>
          {
            return authActions.getLoggedSuccess({response});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.getLoggedFailure(
              {
                errors: errorResponse.error.errors
              }
            ))
          })
        )
      })
    )
  }, 
  {functional: true}
)

export const logInEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService)
  ) =>
  {
    return actions$.pipe(
      ofType(authActions.logIn),
      switchMap(({request}) =>
      {
        return authService.logIn(request).pipe(
          map((response: AuthResponseDTO) =>
          {
            return authActions.logInSuccess({response});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.logInFailure(
              {
                errors: errorResponse.error.errors
              }
            ))
          })
        )
      })
    )
  }, 
  {functional: true}
)

export const signUpEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService)
  ) =>
  {
    return actions$.pipe(
      ofType(authActions.signUp),
      switchMap(({request}) =>
      {
        return authService.signUp(request).pipe(
          map((response: AuthResponseDTO) =>
          {
            return authActions.signUpSuccess({response});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.signUpFailure(
              {
                errors: errorResponse.error.errors
              }
            ))
          })
        )
      })
    )
  }, 
  {functional: true}
)

//use this for team generating
export const redirectAfterSignUpEffect = createEffect(
  (
    actions$ = inject(Actions)
  ) => 
  {
    return actions$.pipe(
      ofType(authActions.signUpSuccess),
      tap(() => 
      {
        window.location.reload();
      })
    )
  },{functional: true, dispatch: false}
)

export const redirectAfterLogInEffect = createEffect(
  (
    actions$ = inject(Actions)
  ) => 
  {
    return actions$.pipe(
      ofType(authActions.logInSuccess),
      tap(() => 
      {
        window.location.reload();
      })
    )
  },{functional: true, dispatch: false}
)

export const logOutEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService)
  ) =>
  {
    return actions$.pipe(
      ofType(authActions.logOut),
      switchMap(() =>
      {
        return authService.logOut().pipe(
          map((response: AuthResponseDTO) =>
          {
            return authActions.logOutSuccess({response});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.logOutFailure(
              {
                errors: errorResponse.error.errors
              }
            ))
          })
        )
      })
    )
  }, 
  {functional: true}
)

export const deleteAccountEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService)
  ) =>
  {
    return actions$.pipe(
      ofType(authActions.deleteAccount),
      switchMap(() =>
      {
        return authService.deleteAccount().pipe(
          map((response: AuthResponseDTO) =>
          {
            return authActions.deleteAccountSuccess({response});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.deleteAccountFailure(
              {
                errors: errorResponse.error.errors
              }
            ))
          })
        )
      })
    )
  }, 
  {functional: true}
)

export const redirectAfterDeleteAccountEffect = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router)
  ) => 
  {
    return actions$.pipe(
      ofType(authActions.deleteAccountSuccess),
      tap(() => 
      {
        router.navigate(['']);
      })
    )
  },{functional: true, dispatch: false}
)

export const changeUserNameEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService)
  ) =>
  {
    return actions$.pipe(
      ofType(authActions.changeUserName),
      switchMap(({request}) =>
      {
        return authService.changeUserName(request).pipe(
          map((response: AuthResponseDTO) =>
          {
            return authActions.changeUserNameSuccess({response});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.changeUserNameFailure(
              {
                errors: errorResponse.error.errors
              }
            ))
          })
        )
      })
    )
  }, 
  {functional: true}
)

export const redirectAfterChangeUserNameEffect = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router)
  ) => 
  {
    return actions$.pipe(
      ofType(authActions.changeUserNameSuccess),
      tap((response) => 
      {
        router.navigate(['/@' + response.response.user?.username]);
      })
    )
  },{functional: true, dispatch: false}
)

export const changeEmailEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService)
  ) =>
  {
    return actions$.pipe(
      ofType(authActions.changeEmail),
      switchMap(({request}) =>
      {
        return authService.changeEmail(request).pipe(
          map((response: AuthResponseDTO) =>
          {
            return authActions.changeEmailSuccess({response});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.changeEmailFailure(
              {
                errors: errorResponse.error.errors
              }
            ))
          })
        )
      })
    )
  }, 
  {functional: true}
)

export const changePasswordEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService)
  ) =>
  {
    return actions$.pipe(
      ofType(authActions.changePassword),
      switchMap(({request}) =>
      {
        return authService.changePassword(request).pipe(
          map((response: AuthResponseDTO) =>
          {
            return authActions.changePasswordSuccess({response});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.changePasswordFailure(
              {
                errors: errorResponse.error.errors
              }
            ))
          })
        )
      })
    )
  }, 
  {functional: true}
)

export const changePictureEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService)
  ) =>
  {
    return actions$.pipe(
      ofType(authActions.changePicture),
      switchMap(({request}) =>
      {
        return authService.changePicture(request).pipe(
          map((response: AuthResponseDTO) =>
          {
            return authActions.changePictureSuccess({response});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.changePictureFailure(
              {
                errors: errorResponse.error.errors
              }
            ))
          })
        )
      })
    )
  }, 
  {functional: true}
)

export const changeCountryEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService)
  ) =>
  {
    return actions$.pipe(
      ofType(authActions.changeCountry),
      switchMap(({request}) =>
      {
        return authService.changeCountry(request).pipe(
          map((response: AuthResponseDTO) =>
          {
            return authActions.changeCountrySuccess({response});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.changeCountryFailure(
              {
                errors: errorResponse.error.errors
              }
            ))
          })
        )
      })
    )
  }, 
  {functional: true}
)

export const changeVisibilityEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService)
  ) =>
  {
    return actions$.pipe(
      ofType(authActions.changeVisibility),
      switchMap(({request}) =>
      {
        return authService.changeVisibility(request).pipe(
          map((response: AuthResponseDTO) =>
          {
            return authActions.changeVisibilitySuccess({response});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.changeVisibilityFailure(
              {
                errors: errorResponse.error.errors
              }
            ))
          })
        )
      })
    )
  }, 
  {functional: true}
)