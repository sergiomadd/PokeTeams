import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, lastValueFrom, Observable, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AuthResponseDTO } from '../../../auth/types/authResponse.dto';
import { Country } from '../../../models/DTOs/country.dto';
import { UtilService } from '../../../shared/services/util.service';
import { TeamService } from '../../team/services/team.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService 
{
  teamService = inject(TeamService);
  util = inject(UtilService);


  private apiUrl = environment.apiURL + 'user/';
  private dataTimeout = 2000;

  constructor(private http: HttpClient) { }

  async queryUser(key: string): Promise<User[]>
  {
    let users: User[] = [];
    let url = this.apiUrl + "query";
    try
    {
      users = await lastValueFrom(this.http.get<User[]>(url, 
        {
          params: 
          {
            key: key
          },
          withCredentials: true
        })
      .pipe(catchError(() => []), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", this.util.getErrorMessage(error));
    }
    return users;
  }

  getUser(userName: string): Observable<User>
  {
    let url = this.apiUrl + userName;
    return this.http.get<User>(url, {withCredentials: true})
      .pipe
      (
        timeout(this.dataTimeout),
        catchError((error) => 
        {
          return throwError(() => error);
        })
      );
  }
  
  async checkUserNameAvailable(userName: string) : Promise<boolean>
  {
    let available: boolean = false;
    let exists: AuthResponseDTO = <AuthResponseDTO>{};
    let url = this.apiUrl + 'check/' + 'username/' + userName;
    try
    {
      const exists$ = this.http.get<AuthResponseDTO>(url);
      exists = await lastValueFrom(exists$);
      if(exists) {available = exists.success}
    }
    catch(error)
    {
      available = false;
      console.log("Error: ", this.util.getErrorMessage(error));
    }
    return available;
  }

  async checkEmailAvailable(email: string) : Promise<boolean>
  {
    let available: boolean = false;
    let exists: AuthResponseDTO = <AuthResponseDTO>{};
    let url = this.apiUrl + 'check/' + 'email/' + email;
    try
    {
      const exists$ = this.http.get<AuthResponseDTO>(url);
      exists = await lastValueFrom(exists$);
      if(exists) {available = exists.success}
    }
    catch(error)
    {
      available = false;
      console.log("Error: ", this.util.getErrorMessage(error));
    }
    return available;
  }

  async getAllProfilePics(): Promise<string[]>
  {
    let pics: string[] = [];
    let url = this.apiUrl + "pictures";
    try
    {
      const pics$ = this.http.get<string[]>(url, {withCredentials: true}).pipe(catchError(() => []), timeout(this.dataTimeout));
      pics = await lastValueFrom(pics$);
    }
    catch(error)
    {
      console.log("Error: ", this.util.getErrorMessage(error));
    }
    return pics;
  }

  
  async getAllCountriesData(): Promise<Country[]>
  {
    let countries: Country[] = [];
    let url = this.apiUrl + "countries";
    try
    {
      const countries$ = this.http.get<Country[]>(url, {withCredentials: true}).pipe(catchError(() => []), timeout(this.dataTimeout));
      countries = await lastValueFrom(countries$);
    }
    catch(error)
    {
      console.log("Error: ", this.util.getErrorMessage(error));
    }
    return countries;
  }
}
