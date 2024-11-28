import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, lastValueFrom, Observable, timeout } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AuthResponseDTO } from '../../../auth/types/authResponse.dto';
import { UtilService } from '../../../shared/services/util.service';
import { Tag } from '../../team/models/tag.model';
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
    users = await lastValueFrom(this.http.get<User[]>(url, 
      {
        params: 
        {
          key: key
        },
        withCredentials: true
      })
      .pipe(timeout(this.dataTimeout)));
    return users;
  }

  getUser(userName: string): Observable<User>
  {
    let url = this.apiUrl + userName;
    return this.http.get<User>(url, {withCredentials: true})
      .pipe
      (
        timeout(this.dataTimeout)
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
    }
    return available;
  }

  async getAllProfilePics(): Promise<string[]>
  {
    let pics: string[] = [];
    let url = this.apiUrl + "pictures";
    const pics$ = this.http.get<string[]>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
    pics = await lastValueFrom(pics$);
    return pics;
  }

  async queryCountriesByName(key: string) : Promise<Tag[]>
  {
    let teraTypes: Tag[] = [];
    let url = this.apiUrl + 'countries/query';
    let params = new HttpParams().set('key', key ?? "");
    teraTypes = await lastValueFrom(this.http.get<Tag[]>(url, {params: params}).pipe(catchError(() => []), timeout(this.dataTimeout)));
    return teraTypes; 
  }
  async getAllCountries() : Promise<Tag[]>
  {
    let tags: Tag[] = [];
    let url = this.apiUrl + "countries/all";
    const countries$ = this.http.get<Tag[]>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
    tags = await lastValueFrom(countries$);
    return tags;
  }
}
