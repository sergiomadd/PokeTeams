import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, lastValueFrom, Observable, timeout } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { authActions } from '../../../auth/store/auth.actions';
import { TeamId } from '../../../models/DTOs/teamId.dto';
import { UtilService } from '../../../shared/services/util.service';
import { SearchQueryDTO } from '../../search/models/searchQuery.dto';
import { SearchQueryResponseDTO } from '../../search/models/searchQueryResponse.dto';
import { Regulation } from '../models/regulation.model';
import { Tag } from '../models/tag.model';
import { Team } from '../models/team.model';
import { TeamSaveResponse } from '../models/teamSaveResponse.model';
import { Tournament } from '../models/tournament.model';

@Injectable({
  providedIn: 'root'
})

export class TeamService 
{  
  store = inject(Store);
  util = inject(UtilService);


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
      console.log("Error: ", this.util.getErrorMessage(error));
    }
    return this.util.toCamelCase(team); 
  }

  async saveTeam(team: Team): Promise<TeamSaveResponse>
  {
    let response: TeamSaveResponse = <TeamSaveResponse>{};
    let url = this.apiUrl + 'team';
    try
    {
      response = await lastValueFrom(this.http.post<TeamSaveResponse>(url, team, {withCredentials: true})
      .pipe(catchError(() => [response]), timeout(this.dataTimeout)));
      this.store.dispatch(authActions.getLogged());
    }
    catch(error)
    {
      console.log("Error saving team in service: ", this.util.getErrorMessage(error));
    }
    return response;
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
      console.log("Error: ", this.util.getErrorMessage(error));
      return this.util.getErrorMessage(error);
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
      console.log("Error: ", this.util.getErrorMessage(error));
      return this.util.getErrorMessage(error);
    }
    this.store.dispatch(authActions.getLogged());
    return deleted;
  }

  searchTeams(searchQuery: SearchQueryDTO) : Observable<SearchQueryResponseDTO> | undefined
  {
    let response: SearchQueryResponseDTO;
    let url = this.apiUrl + 'team/query';
    try
    {
      return this.http.post<SearchQueryResponseDTO>(url, searchQuery)
      .pipe(catchError(() => []), timeout(this.dataTimeout));
    }
    catch(error)
    {
      console.log("Error: ", this.util.getErrorMessage(error));
    }
    return undefined; 
  }

  async getTournamentByName(name: string) : Promise<Tournament>
  {
    let tournament: Tournament = <Tournament>{}
    let url = this.apiUrl + 'Tournament/' + name;
    try
    {
      tournament = await lastValueFrom(this.http.get<Tournament>(url).pipe(catchError(() => [tournament]), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", this.util.getErrorMessage(error));
    }
    return this.util.toCamelCase(tournament); 
  }

  async queryTournamentsByName(key: string) : Promise<Tag[]>
  {
    let tournaments: Tag[] = [];
    let url = this.apiUrl + 'tournament/query';
    try
    {
      let params = new HttpParams().set('key', key ?? "");
      tournaments = await lastValueFrom(this.http.get<Tag[]>(url, {params: params})
      .pipe(catchError(() => []), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", this.util.getErrorMessage(error));
    }
    return tournaments;
  }

  async getAllRegulations() : Promise<Regulation[]>
  {
    let regulations: Regulation[] = [];
    let url = this.apiUrl + 'regulation/all';
    try
    {
      regulations = await lastValueFrom(this.http.get<Regulation[]>(url)
      .pipe(catchError(() => []), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", this.util.getErrorMessage(error));
    }
    return regulations; 
  }

  async getRegulationByIdentifier(identifier: string) : Promise<Regulation>
  {
    let regulation: Regulation = <Regulation>{}
    let url = this.apiUrl + 'Regulation/' + identifier;
    try
    {
      regulation = await lastValueFrom(this.http.get<Regulation>(url).pipe(catchError(() => [regulation]), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", this.util.getErrorMessage(error));
    }
    return this.util.toCamelCase(regulation); 
  }

  async getAllTags() : Promise<Tag[]>
  {
    let tags: Tag[] = [];
    let url = this.apiUrl + 'tag/all';
    try
    {
      tags = await lastValueFrom(this.http.get<Tag[]>(url)
      .pipe(catchError(() => []), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", this.util.getErrorMessage(error));
    }
    return tags; 
  }

  async checkTournamentAvailable(userName: string) : Promise<boolean>
  {
    let available: boolean = false;
    let url = this.apiUrl + 'tournament/' + 'check/' + userName;
    try
    {
      const exists$ = this.http.get<boolean>(url);
      available = await lastValueFrom(exists$);
    }
    catch(error)
    {
      available = false;
      console.log("Error: ", this.util.getErrorMessage(error));
    }
    return available;
  }

  async checkTagAvailable(name: string) : Promise<boolean>
  {
    let available: boolean = false;
    let url = this.apiUrl + 'tag/' + 'check/' + name;
    try
    {
      const exists$ = this.http.get<boolean>(url);
      available = await lastValueFrom(exists$);
    }
    catch(error)
    {
      available = false;
      console.log("Error: ", this.util.getErrorMessage(error));
    }
    return available;
  }
}
