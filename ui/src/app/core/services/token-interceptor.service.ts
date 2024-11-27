import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { authActions } from 'src/app/auth/store/auth.actions';
import { JwtTokenService } from './jwttoken.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService 
{
  jwtTokenService = inject(JwtTokenService);
  injector = inject(Injector)
  store = inject(Store);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
  {
    const skipIntercept = request.headers.has('skip');
    if (skipIntercept) 
    {
        request = request.clone(
          {
            headers: request.headers.delete('skip')
        });
        return next.handle(request);
    }
    const accessToken: string | null = this.jwtTokenService.getAccessToken();
    if(accessToken)
    {
      if(this.jwtTokenService.isAccessTokenExpired(accessToken))
      {
        this.store.dispatch(authActions.refresh({ request: this.jwtTokenService.getTokens() }));
      }
      else
      {
        request = request.clone(
          {
            setHeaders: 
            {
              
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }
    return next.handle(request);
  }
}
