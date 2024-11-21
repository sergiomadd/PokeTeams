import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService 
{
  
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
  {
    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => 
      {
        console.log("intercepter", error)
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) 
        {
           console.log(`Client Error: ${error.error.message}`);
           errorMessage = `Client Error: ${error.error.message}`;
        }
        else 
        {
           console.log(`Server Error [ Code: ${error.status},  Message: ${error.message} ]`);
           switch(error.status)
           {
            case 400:
              //Bad Request
              //Error message provided by backend in HttpErrorResponse
              errorMessage = error.error ?? "Server error"
              break;
            case 401:
              //Unauthorized -> not authenticated
              //Error message provided by backend in HttpErrorResponse
              errorMessage = error.error ?? "Unauthorized"
              break;
            case 403:
              //Forbidden -> authenticated but insufficient role
              //Error message provided by backend in HttpErrorResponse
              errorMessage = error.error ?? "Forbidden"
              break;
            case 404:
              //Not Found
              //Error message provided by backend in HttpErrorResponse
              errorMessage = error.error ?? "Not Found"
              break;
            case 408:
              //Request Timeout
              errorMessage = "Server busym try again later";
              break;
            case 429:
              //Too Many Requests -> rate limiting
              errorMessage = "Too many requests, try again later";
              break;
            case 500:
              //Internal Server Error -> default
              errorMessage = "Server error";
              break;
            case 503:
              //Service Unavailable -> server down
              errorMessage = "Server down";
              break;
            default:
              break;
           }
        }
        return throwError(() => errorMessage);
     }))
  }
}
