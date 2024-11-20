import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtTokenService } from './jwttoken.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService 
{
  jwtTokenService = inject(JwtTokenService);
  injector = inject(Injector)

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
  {
    const token: string = this.jwtTokenService.getToken();
    request = request.clone(
      {
        setHeaders: 
        {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return next.handle(request);
  }
}
