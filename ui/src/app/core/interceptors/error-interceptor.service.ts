import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { CustomError } from '../models/misc/customError.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService 
{
  
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
  {
    return next.handle(request).pipe(catchError((HttpError: HttpErrorResponse) => 
      {
        let error: CustomError =
        {
          status: HttpError.status,
          message: HttpError.error
        };
        if (HttpError.error instanceof ErrorEvent) 
        {
           console.log(`Client Error: ${HttpError.error.message}`);
           error.message = `Client Error: ${HttpError.error.message}`;
        }
        else 
        {
           console.log(`Server Error [ Code: ${HttpError.status},  Message: ${HttpError.message} ]`);
           switch(HttpError.status)
           {
            case 0:
              //Cant reach server -> connection refused
              error.message = "Can't connect with server"
              break;
            case 400:
              //Bad Request
              error.message = HttpError.error ?? "Server error"
              break;
            case 401:
              //Unauthorized -> not authenticated
              //Check if not token refresh request
              if(error.message && !error.message.includes("NoTokenProvided"))
              {
                error.message = HttpError.error ?? "Unauthorized"
              }
              break;
            case 403:
              //Forbidden -> authenticated but insufficient role
              error.message = HttpError.error ?? "Forbidden"
              break;
            case 404:
              //Not Found
              error.message = HttpError.error ?? "Not Found"
              break;
            case 408:
              //Request Timeout
              error.message = "Server busym try again later";
              break;
            case 409:
              //Conflict
              error.message = HttpError.error ?? "Conflict Found";
              break;
            case 429:
              //Too Many Requests -> rate limiting
              error.message = HttpError.error.error ?? "Too many requests, try again later";
              break;
            case 500:
              //Internal Server Error -> default
              error.message = "Server error";
              break;
            case 503:
              //Service Unavailable -> server down
              error.message = "Server down";
              break;
            default:
              error.message = "Server default error";
              break;
           }
        }
        return throwError(() => error);
     }))
  }
}
