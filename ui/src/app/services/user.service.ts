import { Injectable, inject } from '@angular/core';
import { IdentityResponseDTO } from '../models/identityResponseDTO.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { getErrorMessage } from './util';
import { User } from '../models/user.model';
import { GenerateTeamService } from './generate-team.service';
import { LogInDTO } from '../models/logindto.model';
import { SignUpDTO } from '../models/signupdto.model';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class UserService 
{
  private apiUrl = 'https://localhost:7134/api/user/';

  generateTeam: GenerateTeamService = inject(GenerateTeamService)

  constructor(private http: HttpClient) { }

  async loadUserTeams(teamKeys: string[]): Promise<Team[]>
  {
    let teams: Team[] = [];
    for (let i=0; i<teamKeys.length; i++) 
    {
      teams.push(await this.generateTeam.getTeam(teamKeys[i]));
    }
    return teams;
  }
  
  async loadUser(): Promise<User>
  {
    let user: User = <User>{};
    let url = this.apiUrl + 'logged';
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

  async logIn(form: LogInDTO) : Promise<IdentityResponseDTO>
  {
    let response: IdentityResponseDTO = <IdentityResponseDTO>{};
    let url = this.apiUrl + 'login';
    try
    {
      const response$ = this.http.post<IdentityResponseDTO>(url, form, {withCredentials: true});
      response = await lastValueFrom(response$)
      .catch((error: HttpErrorResponse) => {
        console.log("error: ", error);
        return error.error;
      });
      console.log("log in response", response);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    console.log(await this.loadUser())
    return response;
  }

  async logOut() : Promise<IdentityResponseDTO>
  {
    let response: IdentityResponseDTO = <IdentityResponseDTO>{};
    let url = this.apiUrl + 'logout';
    try
    {
      const response$ = this.http.post<IdentityResponseDTO>(url, {withCredentials: true});
      response = await lastValueFrom(response$);
      console.log("logout", response);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return response;
  }

  async signUp(form: SignUpDTO) : Promise<IdentityResponseDTO>
  {
    let response: IdentityResponseDTO = <IdentityResponseDTO>{};
    let url = this.apiUrl + 'signup';
    try
    {
      const response$ = this.http.post<IdentityResponseDTO>(url, form, {withCredentials: true});
      response = await lastValueFrom(response$)
      .catch((error: HttpErrorResponse) => {
        console.log("error: ", error);
        return error.error;
      });
      console.log("signup in response", response);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    console.log(await this.loadUser())
    return response;
  }
}
