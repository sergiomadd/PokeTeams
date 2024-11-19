import { HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, lastValueFrom, map, of, switchMap, tap } from "rxjs";
import { AuthService } from "src/app/auth/services/auth.service";
import { JwtTokenService } from "src/app/core/services/jwttoken.service";
import { UserService } from "src/app/features/user/services/user.service";
import { AuthResponseDTO } from "../types/authResponse.dto";
import { JWTResponse } from "../types/jwtResponse.dto";
import { authActions } from "./auth.actions";


@Injectable()
export class AuthEffects
{
  actions$ = inject(Actions);
  authService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);
  jwtTokenService = inject(JwtTokenService);

  getLogged$ = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.getLogged),
      switchMap(() =>
      {
        return this.authService.getLogged().pipe(
          switchMap(async (response: JWTResponse) =>
          {
            const authResponse: AuthResponseDTO = 
            {
              token: response.token,
              user: this.jwtTokenService.getTokenUsername(response.token) 
              ? await lastValueFrom(this.userService.getUser(this.jwtTokenService.getTokenUsername(response.token)!))
              : null,
              success: true,
              error: null
            }
            return authActions.getLoggedSuccess({authResponse});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.getLoggedFailure(
              {
                error: errorResponse.error.error
              }
            ))
          })
        )
      })
    )
  });
  
  logInEffect = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.logIn),
      switchMap(({request}) =>
      {
        return this.authService.logIn(request).pipe(
          switchMap(async (response: JWTResponse) =>
          {
            const authResponse: AuthResponseDTO = 
            {
              token: response.token,
              user: this.jwtTokenService.getTokenUsername(response.token) 
              ? await lastValueFrom(this.userService.getUser(this.jwtTokenService.getTokenUsername(response.token)!))
              : null,
              success: true,
              error: null
            }
            return authActions.logInSuccess({authResponse});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            console.log("error test:", errorResponse)
            console.log("Error in log in effect: ", errorResponse.error)
            if(errorResponse.status == 0)
            {
              return of(authActions.logInFailure(
                {
                  error: "Server error. Try again."
                }
              ))
            }
            return of(authActions.logInFailure(
              {
                error: errorResponse.error
              }
            ))
          })
        )
      })
    )
  }
  );
  
  signUpEffect = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.signUp),
      switchMap(({request}) =>
      {
        return this.authService.signUp(request).pipe(
          switchMap(async (response: JWTResponse) =>
          {
            const authResponse: AuthResponseDTO = 
            {
              token: response.token,
              user: this.jwtTokenService.getTokenUsername(response.token) 
              ? await lastValueFrom(this.userService.getUser(this.jwtTokenService.getTokenUsername(response.token)!))
              : null,
              success: true,
              error: null
            }
            return authActions.signUpSuccess({authResponse});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.signUpFailure(
              {
                error: errorResponse.error
              }
            ))
          })
        )
      })
    )
  });
  
  //use this for team generating
  redirectAfterSignUpEffect = createEffect(() => 
  {
    return this.actions$.pipe(
      ofType(authActions.signUpSuccess),
      tap(() => 
      {
        window.location.reload();
      })
    )
  },{ dispatch: false });
  
  redirectAfterLogInEffect = createEffect(() => 
  {
    return this.actions$.pipe(
      ofType(authActions.logInSuccess),
      tap(() => 
      {
        //window.location.reload();
      })
    )
  },{dispatch: false});
  
  logOutEffect = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.logOut),
      switchMap(() =>
      {
        return this.authService.logOut().pipe(
          map(() =>
          {
            return authActions.logOutSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.logOutFailure(
              {
                error: errorResponse.error
              }
            ))
          })
        )
      })
    )
  });
  
  deleteAccountEffect = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.deleteAccount),
      switchMap(() =>
      {
        return this.authService.deleteAccount().pipe(
          map(() =>
          {
            return authActions.deleteAccountSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.deleteAccountFailure(
              {
                error: errorResponse.error.error
              }
            ))
          })
        )
      })
    )
  });
  
  redirectAfterDeleteAccountEffect = createEffect(() => 
  {
    return this.actions$.pipe(
      ofType(authActions.deleteAccountSuccess),
      tap(() => 
      {
        this.router.navigate(['']);
      })
    )
  },{dispatch: false});
  
  changeUserNameEffect = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.changeUserName),
      switchMap(({request}) =>
      {
        return this.authService.changeUserName(request).pipe(
          switchMap(async (response: JWTResponse) =>
          {
            const authResponse: AuthResponseDTO = 
            {
              token: response.token,
              user: this.jwtTokenService.getTokenUsername(response.token) 
              ? await lastValueFrom(this.userService.getUser(this.jwtTokenService.getTokenUsername(response.token)!))
              : null,
              success: true,
              error: null
            }
            return authActions.changeUserNameSuccess({authResponse});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.changeUserNameFailure(
              {
                error: errorResponse.error.error
              }
            ))
          })
        )
      })
    )
  });
  
  redirectAfterChangeUserNameEffect = createEffect(() => 
  {
    return this.actions$.pipe(
      ofType(authActions.changeUserNameSuccess),
      tap((response) => 
      {
        this.router.navigate(['/@' + response.authResponse.user?.username]);
      })
    )
  },{dispatch: false});
  
  changeEmailEffect = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.changeEmail),
      switchMap(({request}) =>
      {
        return this.authService.changeEmail(request).pipe(
          switchMap(async (response: JWTResponse) =>
          {
            const authResponse: AuthResponseDTO = 
            {
              token: response.token,
              user: this.jwtTokenService.getTokenUsername(response.token) 
              ? await lastValueFrom(this.userService.getUser(this.jwtTokenService.getTokenUsername(response.token)!))
              : null,
              success: true,
              error: null
            }
            return authActions.changeEmailSuccess({authResponse});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.changeEmailFailure(
              {
                error: errorResponse.error.error
              }
            ))
          })
        )
      })
    )
  });
  
  changePasswordEffect = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.changePassword),
      switchMap(({request}) =>
      {
        return this.authService.changePassword(request).pipe(
          switchMap(async (response: JWTResponse) =>
          {
            const authResponse: AuthResponseDTO = 
            {
              token: response.token,
              user: this.jwtTokenService.getTokenUsername(response.token) 
              ? await lastValueFrom(this.userService.getUser(this.jwtTokenService.getTokenUsername(response.token)!))
              : null,
              success: true,
              error: null
            }
            return authActions.changePasswordSuccess({authResponse});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.changePasswordFailure(
              {
                error: errorResponse.error
              }
            ))
          })
        )
      })
    )
  });
  
  changePictureEffect = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.changePicture),
      switchMap(({request}) =>
      {
        return this.authService.changePicture(request).pipe(
          switchMap(async (response: JWTResponse) =>
          {
            const authResponse: AuthResponseDTO = 
            {
              token: response.token,
              user: this.jwtTokenService.getTokenUsername(response.token) 
              ? await lastValueFrom(this.userService.getUser(this.jwtTokenService.getTokenUsername(response.token)!))
              : null,
              success: true,
              error: null
            }
            return authActions.changePictureSuccess({authResponse});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.changePictureFailure(
              {
                error: errorResponse.error.error
              }
            ))
          })
        )
      })
    )
  });
  
  changeCountryEffect = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.changeCountry),
      switchMap(({request}) =>
      {
        return this.authService.changeCountry(request).pipe(
          switchMap(async (response: JWTResponse) =>
          {
            const authResponse: AuthResponseDTO = 
            {
              token: response.token,
              user: this.jwtTokenService.getTokenUsername(response.token) 
              ? await lastValueFrom(this.userService.getUser(this.jwtTokenService.getTokenUsername(response.token)!))
              : null,
              success: true,
              error: null
            }
            return authActions.changeCountrySuccess({authResponse});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.changeCountryFailure(
              {
                error: errorResponse.error.error
              }
            ))
          })
        )
      })
    )
  });
  
  changeVisibilityEffect = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.changeVisibility),
      switchMap(({request}) =>
      {
        return this.authService.changeVisibility(request).pipe(
          switchMap(async (response: JWTResponse) =>
          {
            const authResponse: AuthResponseDTO = 
            {
              token: response.token,
              user: this.jwtTokenService.getTokenUsername(response.token) 
              ? await lastValueFrom(this.userService.getUser(this.jwtTokenService.getTokenUsername(response.token)!))
              : null,
              success: true,
              error: null
            }
            return authActions.changeVisibilitySuccess({authResponse});
          }),
          catchError((errorResponse: HttpErrorResponse) => 
          {
            return of(authActions.changeVisibilityFailure(
              {
                error: errorResponse.error.error
              }
            ))
          })
        )
      })
    )
  });
}