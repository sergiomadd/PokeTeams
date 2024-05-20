import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, catchError, lastValueFrom, Observable, timeout } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { authActions } from '../auth/store/auth.actions';
import { SearchQueryDTO } from '../models/DTOs/searchQuery.dto';
import { TeamId } from '../models/DTOs/teamId.dto';
import { defaultEditorData, EditorData } from '../models/editorData.model';
import { Team } from '../models/team.model';
import { TeamPreview } from '../models/teamPreview.model';
import { getErrorMessage, toCamelCase } from './util';

@Injectable({
  providedIn: 'root'
})

export class TeamService 
{  
  store = inject(Store);

  private apiUrl = environment.apiURL;
  private dataTimeout = 5000;

  private httpOptionsString = 
  {
    headers: new HttpHeaders({'accept': 'text/plain'}),
    withCredentials: true
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

  saveTeam(team: Team): BehaviorSubject<string>
  {
    let response$ = new BehaviorSubject<string>("");
    let url = this.apiUrl + 'team';
    this.http.post<string>(url, team, {withCredentials: true})
    .pipe(catchError(() => ["error"]), timeout(this.dataTimeout))
    .subscribe(
      {
        next: (resp) => 
        {
          console.log("saving team response: ",resp);
          response$.next(resp["content"]);
          this.store.dispatch(authActions.getLogged());
        },
        error: (error) => 
        {
          console.log("saving team error", error);
          response$.next(error);
        }
      }
    );
    return response$;
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

  async deleteTeam(teamKey: string) : Promise<string | undefined>
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

  searchTeams(searchQuery: SearchQueryDTO) : Observable<TeamPreview[]>
  {
    let teams: TeamPreview[] = [];
    let url = this.apiUrl + 'team/query';
    try
    {
      return this.http.post<TeamPreview[]>(url, searchQuery)
      .pipe(catchError(() => []), timeout(this.dataTimeout));
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return toCamelCase(teams); 
  }
}
