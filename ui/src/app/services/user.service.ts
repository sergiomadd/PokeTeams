import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AuthResponseDTO } from '../models/DTOs/authResponse.dto';
import { Country } from '../models/DTOs/country.dto';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';
import { GenerateTeamService } from './generate-team.service';
import { getErrorMessage } from './util';

@Injectable({
  providedIn: 'root'
})
export class UserService 
{
  private apiUrl = environment.apiURL + 'user/';

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
    await this.loadUserTeams(user);
    return user;
  }

  async loadUserTeams(user?: User): Promise<User | undefined>
  {
    //Clone obj cause user is not extensible
    let loadedUser: User = JSON.parse(JSON.stringify(user));
    if(user && user?.teamKeys)
    {
      let teams: Team[] = [];
      for (let i=0; i<user.teamKeys.length; i++) 
      {
        teams.push(await this.generateTeam.getTeam(user.teamKeys[i]));
      }
      loadedUser.teams = teams;
    }
    return loadedUser;
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
      console.log("Error: ", getErrorMessage(error));
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
      console.log("Error: ", getErrorMessage(error));
    }
    return available;
  }

  async getAllProfilePics(): Promise<string[]>
  {
    let pics: string[] = [];
    let url = this.apiUrl + "pictures";
    try
    {
      const pics$ = this.http.get<string[]>(url, {withCredentials: true});
      pics = await lastValueFrom(pics$);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return pics;
  }

  
  async getAllCountriesData(): Promise<Country[]>
  {
    let countries: Country[] = [];
    let url = this.apiUrl + "countries";
    try
    {
      const countries$ = this.http.get<Country[]>(url, {withCredentials: true});
      countries = await lastValueFrom(countries$);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return countries;
  }
}
