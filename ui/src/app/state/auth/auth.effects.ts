import { Inject, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "src/app/services/user.service";
import { authActions } from "./auth.actions";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { User } from "../../models/user.model"
import { AuthResponseDTO } from "src/app/models/DTOs/authResponse.dto";
import { LoggedUser } from "src/app/models/loggedUser.model";
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