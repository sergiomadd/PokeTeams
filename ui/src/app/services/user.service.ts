import { Injectable, inject } from '@angular/core';
import { AuthResponseDTO } from '../models/DTOs/authResponse.dto';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { getErrorMessage } from './util';
import { User } from '../models/user.model';
import { GenerateTeamService } from './generate-team.service';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class UserService 
{
  private apiUrl = 'https://localhost:7134/api/user/';

  generateTeam: GenerateTeamService = inject(GenerateTeamService)

  constructor(private http: HttpClient) { }

  async getUser(userName: string): Promise<User>
  {
    let user: User = <User>{};
    let url = this.apiUrl + userName;
    try
    {
      const user$ = this.http.get<User>(url, {withCredentials: true});
      user = await lastValueFrom(user$);
      console.log("user in service", user);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    if(user && user.teamKeys)
    {
      user.teams = await this.loadUserTeams(user.teamKeys);
    }
    return user;
  }

  async loadUserTeams(teamKeys: string[]): Promise<Team[]>
  {
    let teams: Team[] = [];
    for (let i=0; i<teamKeys.length; i++) 
    {
      teams.push(await this.generateTeam.getTeam(teamKeys[i]));
    }
    return teams;
  }
  
  //return bool
  async checkUserNameAvailable(userName: string) : Promise<AuthResponseDTO>
  {
    let exists: AuthResponseDTO = <AuthResponseDTO>{};
    let url = this.apiUrl + 'check/' + 'username/' + userName;
    try
    {
      const exists$ = this.http.get<AuthResponseDTO>(url);
      exists = await lastValueFrom(exists$);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return exists;
  }

  //return bool
  async checkEmailAvailable(email: string) : Promise<AuthResponseDTO>
  {
    let exists: AuthResponseDTO = <AuthResponseDTO>{};
    let url = this.apiUrl + 'check/' + 'email/' + email;
    try
    {
      const exists$ = this.http.get<AuthResponseDTO>(url);
      exists = await lastValueFrom(exists$);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return exists;
  }
}
