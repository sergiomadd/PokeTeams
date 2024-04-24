import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, lastValueFrom, timeout } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { authActions } from '../auth/store/auth.actions';
import { TeamId } from '../models/DTOs/teamId.dto';
import { defaultEditorData, EditorData } from '../models/editorData.model';
import { Team } from '../models/team.model';
import { getErrorMessage, toCamelCase } from './util';

@Injectable({
  providedIn: 'root'
})

export class TeamService 
{  
  store = inject(Store);

  private apiUrl = environment.apiURL;
  private dataTimeout = 2000;

  private httpOptionsString = 
  {
    headers: new HttpHeaders({'accept': 'text/plain'})
  }

  constructor(private http: HttpClient) 
  {

  }

  async getTeam(id: string) : Promise<Team>
  {
    let team: Team = <Team>{}
    let url = this.apiUrl + 'team/' + id;
    try
    {
      team = await lastValueFrom(this.http.get<Team>(url).pipe(catchError(() => [team]), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return toCamelCase(team); 
  }

  async getOptionsData()
  {
    let optionsData: EditorData = <EditorData>{}
    let url = this.apiUrl + 'editor';
    try
    {
      optionsData = await lastValueFrom(this.http.get<EditorData>(url).pipe(catchError(() => [defaultEditorData]), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return optionsData; 
  }

  async saveTeam(team: Team): Promise<string>
  {
    let response: object = {};
    let url = this.apiUrl + 'team';
    console.log("team with tags", team);
    
    try
    {
      this.http.post(url, team)
      .pipe(catchError(() => []), timeout(this.dataTimeout))
      .subscribe(
        {
          next: (resp) => 
          {
            console.log("saving team response: ",resp);
            response = resp
          },
          error: (error) => 
          {
            console.log("saving team error", error);
            response = error
          }
        }
      );
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
      return getErrorMessage(error);
    }
    this.store.dispatch(authActions.getLogged());
    
    return response["content"];
  }

  async incrementViewCount(teamKey: string)
  {
    let url = this.apiUrl + 'team/increment';
    try
    {
      const data: TeamId = {id: teamKey}
      this.http.post(url, data, this.httpOptionsString).subscribe();
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
      return getErrorMessage(error);
    }
  }

  async deleteTeam(teamKey: string): Promise<string | undefined>
  {
    let url = this.apiUrl + 'team/delete';
    let deleted: string | undefined = undefined;
    try
    {
      const data: TeamId = {id: teamKey}
      deleted = await lastValueFrom(this.http.post<string>(url, data, this.httpOptionsString)
      .pipe(timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
      return getErrorMessage(error);
    }
    this.store.dispatch(authActions.getLogged());
    return deleted;
  }
}
