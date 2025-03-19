import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, lastValueFrom, timeout } from "rxjs";
import { SearchQueryDTO } from "src/app/core/models/search/searchQuery.dto";
import { environment } from "src/environments/environment.development";
import { UtilService } from "../helpers/util.service";
import { Pokemon } from "../models/pokemon/pokemon.model";
import { PokemonPreview } from "../models/pokemon/pokemonPreview.model";
import { SearchQueryResponseDTO } from "../models/search/searchQueryResponse.dto";
import { Regulation } from "../models/team/regulation.model";
import { Tag } from "../models/team/tag.model";
import { Team } from "../models/team/team.model";
import { TeamData } from "../models/team/teamData.model";
import { TeamId } from "../models/team/teamId.dto";
import { TeamSaveResponse } from "../models/team/teamSaveResponse.model";
import { Tournament } from "../models/team/tournament.model";

@Injectable({
  providedIn: 'root'
})

export class TeamService 
{  
  store = inject(Store);
  util = inject(UtilService);

  private apiUrl = environment.apiURL;
  private dataTimeout = 5000;

  constructor(private http: HttpClient) 
  {

  }
 
  getTeam(id: string) : Observable<Team>
  {
    let url = this.apiUrl + 'team/' + id;
    return this.http.get<Team>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  getTeamData(id: string) : Observable<TeamData>
  {
    let url = this.apiUrl + 'team/data/' + id;
    return this.http.get<TeamData>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  getPokemonById(id: number) : Observable<Pokemon>
  {
    let url = this.apiUrl + 'team/pokemon/' + id;
    return this.http.get<Pokemon>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  getPokemonByIdNoLang(id: number) : Observable<Pokemon>
  {
    let url = this.apiUrl + 'team/pokemon/nolang/' + id;
    return this.http.get<Pokemon>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  async getPokemonPreviewById(id: number) : Promise<PokemonPreview>
  {
    let pokemonPreview: PokemonPreview = <PokemonPreview>{}
    let url = this.apiUrl + 'team/pokemon/preview/' + id;
    pokemonPreview = await lastValueFrom(this.http.get<PokemonPreview>(url).pipe(timeout(this.dataTimeout * 2)));
    return pokemonPreview;
  }
  
  getTeamPokemonPreviews(teamID: string) : Observable<PokemonPreview[]>
  {
    let url = this.apiUrl + 'team/pokemon-previews/' + teamID;
    return this.http.get<PokemonPreview[]>(url).pipe(timeout(this.dataTimeout * 2));
  }

  saveTeam(team: Team): Observable<TeamSaveResponse>
  {
    let url = this.apiUrl + 'team/save';
    return this.http.post<TeamSaveResponse>(url, team, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  updateTeam(team: Team): Observable<TeamSaveResponse>
  {
    let url = this.apiUrl + 'team/update';
    return this.http.post<TeamSaveResponse>(url, team, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }
  
  async incrementViewCount(teamKey: string)
  {
    let url = this.apiUrl + 'team/increment';
    const data: TeamId = {id: teamKey}
    this.http.post(url, data).subscribe();
  }

  deleteTeam(teamKey: string) : Observable<string>
  {
    let url = this.apiUrl + 'team/delete';
    const data: TeamId = {id: teamKey}
    return this.http.post<string>(url, data, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  searchTeams(searchQuery: SearchQueryDTO) : Observable<SearchQueryResponseDTO> | undefined
  {
    let url = this.apiUrl + 'team/query';
    return this.http.post<SearchQueryResponseDTO>(url, searchQuery, {withCredentials: true});
  }

  async getTournamentByIdentifier(identifier: string) : Promise<Tournament>
  {
    let tournament: Tournament = <Tournament>{}
    let url = this.apiUrl + 'tournament/' + identifier;
    tournament = await lastValueFrom(this.http.get<Tournament>(url).pipe(timeout(this.dataTimeout)));
    return tournament; 
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
    let url = this.apiUrl + 'regulation/' + identifier;
    regulation = await lastValueFrom(this.http.get<Regulation>(url).pipe(timeout(this.dataTimeout)));
    return regulation; 
  }

  async getTagByIdentifier(identifier: string) : Promise<Tag>
  {
    let tag: Tag = <Tag>{};
    let url = this.apiUrl + 'tag/' + identifier;
    tag = await lastValueFrom(this.http.get<Tag>(url).pipe(timeout(this.dataTimeout)));
    return tag; 
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
