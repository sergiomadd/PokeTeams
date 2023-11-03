import { Injectable } from '@angular/core';
import { Team } from '../models/team.model';
import { HttpClient } from '@angular/common/http';
import { getErrorMessage } from './util';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GenerateTeamService 
{  
  private apiUrl = 'https://localhost:7134/api/';

  constructor(private http: HttpClient) 
  {

  }

  async saveTeam(team: Team)
  {
    let teamLink: string = "";
    let url = this.apiUrl + 'pokemon/' + name;
    try
    {
      const teamLink$ = this.http.post<string>(url, team);
      teamLink = await lastValueFrom(teamLink$);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    
    return teamLink;
  }

}
