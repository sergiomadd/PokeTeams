import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { CustomError } from 'src/app/shared/models/customError.model';
import { authActions } from '../store/auth.actions';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService 
{
  authService = inject(AuthService);
  store = inject(Store);

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
  {
    return next.handle(request).pipe(catchError((HttpError: HttpErrorResponse) => 
      {
        let error: CustomError =
        {
          status: HttpError.status,
          message: HttpError.message
        };
        if(error.status === 401 && error.message && error.message.includes("NoTokensProvided"))
        {
          this.store.dispatch(authActions.logOutSuccess());
        }
        else if(error.status === 401 && error.message && error.message.includes("NoAccessTokenProvided"))
        {
          return this.authService.refreshTokens().pipe(
            switchMap(() => 
            {
              //Retry original request after token refresh
              return next.handle(request);
            })
          );
        }
        return throwError(() => error);
     }))
  }
}
