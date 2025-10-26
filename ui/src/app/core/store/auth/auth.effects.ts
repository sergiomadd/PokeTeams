import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, lastValueFrom, map, of, switchMap, tap } from "rxjs";
import { LocalStorageService } from "../../interceptors/local-storage.service";
import { CustomError } from "../../models/misc/customError.model";
import { User } from "../../models/user/user.model";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { authActions } from "./auth.actions";
import { AuthResponseDTO } from "./authResponse.dto";


@Injectable()
export class AuthEffects
{
  actions$ = inject(Actions);
  authService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);
  localStorage = inject(LocalStorageService);

  refresh$ = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.refresh),
      switchMap(() =>
      {
        return this.authService.refreshTokens().pipe(
          switchMap(async () =>
          {
            const loggedUser: User | null = await lastValueFrom(this.authService.getLoggedUser())
            const authResponse: AuthResponseDTO = 
            {
              loggedUser: loggedUser,
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
          switchMap(async () =>
          {
            const loggedUser: User | null = await lastValueFrom(this.authService.getLoggedUser())
            const authResponse: AuthResponseDTO = 
            {
              loggedUser: loggedUser,
              success: true,
              error: null
            }
            return authActions.logInSuccess({authResponse});
          }),
          catchError((error: CustomError) => 
          {
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
          switchMap(async () =>
          {
            const loggedUser: User | null = await lastValueFrom(this.authService.getLoggedUser())
            const authResponse: AuthResponseDTO = 
            {
              loggedUser: loggedUser,
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
          switchMap(async () =>
          {
            const loggedUser: User | null = await lastValueFrom(this.authService.getLoggedUser())
            const authResponse: AuthResponseDTO = 
            {
              loggedUser: loggedUser,
              success: true,
              error: null
            }
            return authActions.changeNameSuccess({authResponse});
          }),
          catchError((error: CustomError) => 
          {
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
          switchMap(async () =>
          {
            const loggedUser: User | null = await lastValueFrom(this.authService.getLoggedUser())
            const authResponse: AuthResponseDTO = 
            {
              loggedUser: loggedUser,
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
        const newUsername = response.authResponse.loggedUser?.username;
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
          switchMap(async () =>
          {
            const loggedUser: User | null = await lastValueFrom(this.authService.getLoggedUser())
            const authResponse: AuthResponseDTO = 
            {
              loggedUser: loggedUser,
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
          switchMap(async () =>
          {
            const loggedUser: User | null = await lastValueFrom(this.authService.getLoggedUser())
            const authResponse: AuthResponseDTO = 
            {
              loggedUser: loggedUser,
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
          switchMap(async () =>
          {
            const loggedUser: User | null = await lastValueFrom(this.authService.getLoggedUser())
            const authResponse: AuthResponseDTO = 
            {
              loggedUser: loggedUser,
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
          switchMap(async () =>
          {
            const loggedUser: User | null = await lastValueFrom(this.authService.getLoggedUser())
            const authResponse: AuthResponseDTO = 
            {
              loggedUser: loggedUser,
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
          switchMap(async () =>
          {
            const loggedUser: User | null = await lastValueFrom(this.authService.getLoggedUser())
            const authResponse: AuthResponseDTO = 
            {
              loggedUser: loggedUser,
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
          switchMap(async () =>
          {
            const loggedUser: User | null = await lastValueFrom(this.authService.getLoggedUser())
            const authResponse: AuthResponseDTO = 
            {
              loggedUser: loggedUser,
              success: true,
              error: null
            }
            return authActions.confirmEmailSuccess({authResponse});
          }),
          catchError((error: CustomError) => 
          {
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

  forgotPasswordEffect = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.forgotPassword),
      switchMap(({request}) =>
      {
        return this.authService.forgotEmail(request).pipe(
          map(() =>
          {
            return authActions.resetPasswordSuccess();
          }),
          catchError((error: CustomError) => 
          {
            return of(authActions.forgotPasswordFailure(
              {
                error: error.message
              }
            ))
          })
        )
      })
    )
  });

  resetPasswordEffect = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.resetPassword),
      switchMap(({request}) =>
      {
        return this.authService.resetPassword(request).pipe(
          map(() =>
          {
            return authActions.resetPasswordSuccess();
          }),
          catchError((error: CustomError) => 
          {
            return of(authActions.resetPasswordFailure(
              {
                error: error.message
              }
            ))
          })
        )
      })
    )
  });

  externalLogInEffect = createEffect(() =>
  {
    return this.actions$.pipe(
      ofType(authActions.externalLogIn),
      switchMap(({request}) =>
      {
        return this.authService.externalLogIn(request).pipe(
          switchMap(async () =>
          {
            const loggedUser: User | null = await lastValueFrom(this.authService.getLoggedUser())
            const authResponse: AuthResponseDTO = 
            {
              loggedUser: loggedUser,
              success: true,
              error: null
            }
            return authActions.externalLogInSuccess({authResponse});
          }),
          catchError((error: CustomError) => 
          {
            return of(authActions.externalLogInFailure(
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