import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { lastValueFrom, Observable, timeout } from 'rxjs';
import { environment } from 'src/environments/environment.development';
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
 
  getTeam(id: string) : Observable<Team>
  {
    let url = this.apiUrl + 'team/' + id;
    return this.http.get<Team>(url);
    //return this.util.toCamelCase(team); 
  }

  saveTeam(team: Team): Observable<TeamSaveResponse>
  {
    let url = this.apiUrl + 'team';
    return this.http.post<TeamSaveResponse>(url, team, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }
  
  async incrementViewCount(teamKey: string)
  {
    let url = this.apiUrl + 'team/increment';
    const data: TeamId = {id: teamKey}
    this.http.post(url, data, this.httpOptionsString).subscribe();
  }

  async deleteTeam(teamKey: string) : Promise<string | undefined>
  {
    let url = this.apiUrl + 'team/delete';
    let deleted: string | undefined = undefined;
    const data: TeamId = {id: teamKey}
    deleted = await lastValueFrom(this.http.post<string>(url, data, this.httpOptionsString).pipe(timeout(this.dataTimeout)));
    return deleted;
  }

  searchTeams(searchQuery: SearchQueryDTO) : Observable<SearchQueryResponseDTO> | undefined
  {
    let url = this.apiUrl + 'team/query';
    return this.http.post<SearchQueryResponseDTO>(url, searchQuery).pipe(timeout(this.dataTimeout));
  }

  async getTournamentByName(name: string) : Promise<Tournament>
  {
    let tournament: Tournament = <Tournament>{}
    let url = this.apiUrl + 'Tournament/' + name;
    tournament = await lastValueFrom(this.http.get<Tournament>(url).pipe(timeout(this.dataTimeout)));
    return tournament; 
  }

  async queryTournamentsByName(key: string) : Promise<Tag[]>
  {
    let tournaments: Tag[] = [];
    let url = this.apiUrl + 'tournament/query';
    let params = new HttpParams().set('key', key ?? "");
    tournaments = await lastValueFrom(this.http.get<Tag[]>(url, {params: params}).pipe(timeout(this.dataTimeout)));
    return tournaments;
  }

  async getAllRegulations() : Promise<Regulation[]>
  {
    let regulations: Regulation[] = [];
    let url = this.apiUrl + 'regulation/all';
    regulations = await lastValueFrom(this.http.get<Regulation[]>(url).pipe(timeout(this.dataTimeout)));
    return regulations; 
  }

  async getRegulationByIdentifier(identifier: string) : Promise<Regulation>
  {
    let regulation: Regulation = <Regulation>{}
    let url = this.apiUrl + 'Regulation/' + identifier;
    regulation = await lastValueFrom(this.http.get<Regulation>(url).pipe(timeout(this.dataTimeout)));

    return this.util.toCamelCase(regulation); 
  }

  async getAllTags() : Promise<Tag[]>
  {
    let tags: Tag[] = [];
    let url = this.apiUrl + 'tag/all';
    tags = await lastValueFrom(this.http.get<Tag[]>(url).pipe(timeout(this.dataTimeout)));
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
    }
    return available;
  }
}
