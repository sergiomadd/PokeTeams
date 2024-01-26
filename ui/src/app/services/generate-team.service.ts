import { Injectable } from '@angular/core';
import { Team } from '../models/team.model';
import { HttpClient } from '@angular/common/http';
import { getErrorMessage, toCamelCase } from './util';
import { lastValueFrom } from 'rxjs';
import { EditorData } from '../models/editorData.model';

@Injectable({
  providedIn: 'root'
})

export class GenerateTeamService 
{  
  private apiUrl = 'https://localhost:7134/api/';

  constructor(private http: HttpClient) 
  {

  }

  async getTeam(id: string) : Promise<Team>
  {
    let team: Team = <Team>{}
    let url = this.apiUrl + 'team/' + id;
    try
    {
      const team$ = this.http.get<Team>(url);
      team = await lastValueFrom(team$, { defaultValue: team });
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    console.log("team gotten:", toCamelCase(team));
    return toCamelCase(team); 
  }

  async getOptionsData()
  {
    let optionsData: EditorData = <EditorData>{}
    let url = this.apiUrl + 'editor';
    try
    {
      const optionsData$ = this.http.get<EditorData>(url);
      optionsData = await lastValueFrom(optionsData$);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    console.log("Options data gotten:", optionsData);
    return optionsData; 
  }

  async saveTeam(team: Team): Promise<string>
  {
    let teamLink: object = {};
    let url = this.apiUrl + 'team';
    try
    {
      const teamLink$ = this.http.post(url, team);
      teamLink = await lastValueFrom(teamLink$);
      console.log("teamlink in service", teamLink);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
      return getErrorMessage(error);
    }
    
    return teamLink["content"];
  }
}
