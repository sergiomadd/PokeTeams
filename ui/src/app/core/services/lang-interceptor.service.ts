import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectLang } from '../config/store/config.selectors';

@Injectable({
  providedIn: 'root'
})
export class LangInterceptorService implements HttpInterceptor 
{
  store = inject(Store);
  selectedLang?: string;

  constructor() 
  {
    this.store.select(selectLang).subscribe(lang => 
    {
      this.selectedLang = lang;
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
  {
    request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});
    if (!request.headers.has('Accept')) 
    {
      request = request.clone({headers: request.headers.set('Accept', 'application/json')});
    }
    if(this.selectedLang)
    {
      request = request.clone({headers: request.headers.set('Accept-Language', `${this.selectedLang};q=1`)});
    }
    else
    {
      request = request.clone({headers: request.headers.set('Accept-Language', 'en;q=1')});
    }
    return next.handle(request);
  }
}
