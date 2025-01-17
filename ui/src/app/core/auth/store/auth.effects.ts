import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { JwtTokenService } from "src/app/core/services/jwttoken.service";
import { UserService } from "src/app/features/user/services/user.service";
import { CustomError } from "src/app/shared/models/customError.model";
import { LocalStorageService } from "../../services/local-storage.service";
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
  localStorage = inject(LocalStorageService);
  jwtTokenService = inject(JwtTokenService);

  refresh$ = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.refresh),
      switchMap(({request}) =>
      {
        return this.authService.refreshTokens(request).pipe(
          switchMap(async (response: JWTResponse) =>
          {
            const authResponse: AuthResponseDTO = 
            {
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              success: true,
              error: null
            }
            return authActions.refreshSuccess({authResponse});
          }),
          catchError((error: CustomError) => 
          {
            return of(authActions.refreshFailure(
              {
                error: error.message
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
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              success: true,
              error: null
            }
            return authActions.logInSuccess({authResponse});
          }),
          catchError((error: CustomError) => 
          {
            console.log("Error in log in effect: ", error)
            return of(authActions.logInFailure(
              {
                error: error.message
              }
            ))
          })
        )
      })
    )
  });
  
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
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              success: true,
              error: null
            }
            return authActions.signUpSuccess({authResponse});
          }),
          catchError((error: CustomError) => 
          {
            return of(authActions.signUpFailure(
              {
                error: error.message
              }
            ))
          })
        )
      })
    )
  });
  
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
          catchError((error: CustomError) => 
          {
            return of(authActions.logOutFailure(
              {
                
                error: error.message
              }
            ))
          })
        )
      })
    )
  });

  redirectAfterLogOutEffect = createEffect(() => 
  {
    return this.actions$.pipe(
      ofType(authActions.logOutSuccess),
      tap(() => 
      {
        this.router.navigate(['']);
      })
    )
  },{dispatch: false});
  
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
          catchError((error: CustomError) => 
          {
            return of(authActions.deleteAccountFailure(
              {
                error: error.message
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
  
  changeNameEffect = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.changeName),
      switchMap(({request}) =>
      {
        return this.authService.changeName(request).pipe(
          switchMap(async (response: JWTResponse) =>
          {
            const authResponse: AuthResponseDTO = 
            {
              accessToken: response.accessToken,
              refreshToken: null,
              success: true,
              error: null
            }
            return authActions.changeNameSuccess({authResponse});
          }),
          catchError((error: CustomError) => 
          {
            console.log(error);
            return of(authActions.changeNameFailure(
              {
                error: error.message
              }
            ))
          })
        )
      })
    )
  });
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
              accessToken: response.accessToken,
              refreshToken: null,
              success: true,
              error: null
            }
            return authActions.changeUserNameSuccess({authResponse});
          }),
          catchError((error: CustomError) => 
          {
            return of(authActions.changeUserNameFailure(
              {
                error: error.message
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
        const newUsername = this.jwtTokenService.getTokenUsername(response.authResponse.accessToken ?? "");
        if(newUsername)
        {
          this.router.navigate(['/@' + newUsername]);
        }
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
              accessToken: response.accessToken,
              refreshToken: null,
              success: true,
              error: null
            }
            return authActions.changeEmailSuccess({authResponse});
          }),
          catchError((error: CustomError) => 
          {
            return of(authActions.changeEmailFailure(
              {
                error: error.message
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
              accessToken: response.accessToken,
              refreshToken: null,
              success: true,
              error: null
            }
            return authActions.changePasswordSuccess({authResponse});
          }),
          catchError((error: CustomError) => 
          {
            return of(authActions.changePasswordFailure(
              {
                error: error.message
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
              accessToken: response.accessToken,
              refreshToken: null,
              success: true,
              error: null
            }
            return authActions.changePictureSuccess({authResponse});
          }),
          catchError((error: CustomError) => 
          {
            return of(authActions.changePictureFailure(
              {
                error: error.message
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
              accessToken: response.accessToken,
              refreshToken: null,
              success: true,
              error: null
            }
            return authActions.changeCountrySuccess({authResponse});
          }),
          catchError((error: CustomError) => 
          {
            return of(authActions.changeCountryFailure(
              {
                error: error.message
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
              accessToken: response.accessToken,
              refreshToken: null,
              success: true,
              error: null
            }
            return authActions.changeVisibilitySuccess({authResponse});
          }),
          catchError((error: CustomError) => 
          {
            return of(authActions.changeVisibilityFailure(
              {
                error: error.message
              }
            ))
          })
        )
      })
    )
  });

  sendVerificationEffect = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.sendVerification),
      switchMap(() =>
      {
        return this.authService.getEmailConfirmationCode().pipe(
          map(() =>
          {
            return authActions.sendVerificationSuccess();
          }),
          catchError((error: CustomError) => 
          {
            return of(authActions.sendVerificationFailure(
              {
                error: error.message
              }
            ))
          })
        )
      })
    )
  });

  confirmEmailEffect = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.confirmEmail),
      switchMap(({request}) =>
      {
        return this.authService.confirmEmail(request).pipe(
          switchMap(async (response: JWTResponse) =>
          {
            const authResponse: AuthResponseDTO = 
            {
              accessToken: response.accessToken,
              refreshToken: null,
              success: true,
              error: null
            }
            return authActions.confirmEmailSuccess({authResponse});
          }),
          catchError((error: CustomError) => 
          {
            console.log("Error in log in effect: ", error)
            return of(authActions.confirmEmailFailure(
              {
                error: error.message
              }
            ))
          })
        )
      })
    )
  });
}