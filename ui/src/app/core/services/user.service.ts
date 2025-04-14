import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, lastValueFrom, Observable, timeout } from 'rxjs';
import { TeamService } from 'src/app/core/services/team.service';
import { environment } from 'src/environments/environment';
import { User } from '../../features/user/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService 
{
  teamService = inject(TeamService);

  private apiUrl = environment.apiURL + 'user/';
  private dataTimeout = 2000;

  constructor(private http: HttpClient) { }

  getUser(userName: string): Observable<User>
  {
    let url = this.apiUrl + userName;
    return this.http.get<User>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }
  
  async checkUserNameAvailable(userName: string) : Promise<boolean>
  {
    let available: boolean = true;
    let url = this.apiUrl + 'check/' + 'username/' + userName;
    await lastValueFrom(this.http.get(url).pipe(catchError(() => [available = false])));
    return available;
  }

  async checkEmailAvailable(email: string) : Promise<boolean>
  {
    let available: boolean = true;
    let url = this.apiUrl + 'check/' + 'email/' + email;
    await lastValueFrom(this.http.get(url).pipe(catchError(() => [available = false])));
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
}
