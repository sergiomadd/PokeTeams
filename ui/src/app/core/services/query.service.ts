import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
import { QueryItem } from '../models/misc/queryResult.model';
import { Ability } from '../models/pokemon/ability.model';
import { Item } from '../models/pokemon/item.model';
import { Move } from '../models/pokemon/move.model';
import { Nature } from '../models/pokemon/nature.model';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { Type } from '../models/pokemon/type.model';
import { Regulation } from '../models/team/regulation.model';
import { Tournament } from '../models/team/tournament.model';

@Injectable({
  providedIn: 'root'
})
export class QueryService 
{
  private apiUrl = environment.apiUrl;
  private dataTimeout = 5000;

  cachedUsers: QueryItem[] = [];
  cachedCountries: QueryItem[] = [];
  cachedTournaments: QueryItem[] = [];
  cachedRegulations: QueryItem[] = [];
  cachedTags: QueryItem[] = [];
  cachedPokemon: QueryItem[] = [];
  cachedItems: QueryItem[] = [];
  cachedMoves: QueryItem[] = [];
  cachedAbilities: QueryItem[] = [];
  cachedNatures: QueryItem[] = [];
  cachedTeratypes: QueryItem[] = [];

  constructor(private http: HttpClient) { }

  tryUseCache(key: string, cachedItems: QueryItem[]): Observable<QueryItem[]> | boolean
  {
    if(this.cachedPokemon.length > 0)
    {
      const filteredItems: QueryItem[] = this.filterNameStartsWith(key, cachedItems)
      if(filteredItems.length > 0)
      {
        return of(filteredItems);
      }
      return of([]);
    }
    return false;
  }

  filterNameStartsWith(name: string, queryItems: QueryItem[]): QueryItem[]
  {
    const lowerName = name.toLowerCase();
    return queryItems.filter(item => item.name.toLowerCase().startsWith(lowerName));
  }

  filterNameIncludes(name: string, queryItems: QueryItem[]): QueryItem[]
  {
    const lowerName = name.toLowerCase();
    return queryItems.filter(item => item.name.toLowerCase().includes(lowerName));
  }

  //User
 
  queryUser(key: string): Observable<QueryItem[]>
  {
    if(!key) 
    {
      this.cachedUsers = [];
      return of([]);
    }
    if(this.cachedUsers.length > 0)
    {
      const filteredItems: QueryItem[] = this.filterNameStartsWith(key, this.cachedUsers)
      if(filteredItems.length > 0)
      {
        return of(filteredItems);
      }
      return of([]);
    }
    let url = this.apiUrl + "user/query";
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryItem[]>(url, {params: params, withCredentials: true}).pipe(timeout(this.dataTimeout), tap(data => this.cachedUsers = data));
  }
  queryUserCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryUser(args);
  }

  queryCountriesByName(key: string) : Observable<QueryItem[]>
  {
    if(!key) 
    {
      return of(this.cachedCountries);
    }
    if(this.cachedCountries.length > 0)
    {
      const filteredItems: QueryItem[] = this.filterNameIncludes(key, this.cachedCountries)
      if(filteredItems.length > 0)
      {
        return of(filteredItems);
      }
      return of([]);
    }
    let url = this.apiUrl + 'user/countries/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryItem[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryCountriesCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryCountriesByName(args);
  }

  getAllCountries() : Observable<QueryItem[]>
  {
    let url = this.apiUrl + "user/countries/all";
    return this.http.get<QueryItem[]>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout), tap(data => this.cachedCountries = data));
  }
  countriesAllCallback = (): Observable<QueryItem[]> => 
  {
    return this.getAllCountries();
  }

  //Team
  
  queryTournamentsByName(key: string) : Observable<QueryItem[]>
  {
    if(!key) 
    {
      return of(this.cachedTournaments);
    }
    if(this.cachedTournaments.length > 0)
    {
      const filteredItems: QueryItem[] = this.filterNameIncludes(key, this.cachedTournaments)
      if(filteredItems.length > 0)
      {
        return of(filteredItems);
      }
      return of([]);
    }
    let url = this.apiUrl + 'tournament/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryItem[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryTournamentCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryTournamentsByName(args);
  }

  queryAllTournaments() : Observable<QueryItem[]>
  {
    if(this.cachedTournaments.length > 0)
    {
      return of(this.cachedTournaments);
    }
    let url = this.apiUrl + 'tournament/query/all';
    return this.http.get<QueryItem[]>(url).pipe(timeout(this.dataTimeout), tap(data => this.cachedTournaments = data));
  }
  tournamentAllCallback = (): Observable<QueryItem[]> => 
  {
    return this.queryAllTournaments();
  }

  queryRegulation(key: string): Observable<QueryItem[]>
  {
    if(!key) 
    {
      return of(this.cachedRegulations);
    }
    if(this.cachedRegulations.length > 0)
    {
      const filteredItems: QueryItem[] = this.filterNameIncludes(key, this.cachedRegulations)
      if(filteredItems.length > 0)
      {
        return of(filteredItems);
      }
      return of([]);
    }
    let url = this.apiUrl + 'regulation/query/all';
    return this.http.get<QueryItem[]>(url).pipe(timeout(this.dataTimeout))
  }
  queryRegulationCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryRegulation(args);
  }

  queryAllRegulations() : Observable<QueryItem[]>
  {
    if(this.cachedRegulations.length > 0)
    {
      return of(this.cachedRegulations);
    }
    let url = this.apiUrl + 'regulation/query/all';
    return this.http.get<QueryItem[]>(url).pipe(timeout(this.dataTimeout), tap(data => this.cachedRegulations = data));
  }
  regulationAllCallback = (): Observable<QueryItem[]> => 
  {
    return this.queryAllRegulations();
  }

  queryTags(key: string): Observable<QueryItem[]>
  {
    if(!key) 
    {
      return of(this.cachedTags);
    }
    if(this.cachedTags.length > 0)
    {
      const filteredItems: QueryItem[] = this.filterNameIncludes(key, this.cachedTags)
      if(filteredItems.length > 0)
      {
        return of(filteredItems);
      }
      return of([]);
    }
    let url = this.apiUrl + 'tag/query/all';
    return this.http.get<QueryItem[]>(url).pipe(timeout(this.dataTimeout))
  }
  queryTagCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryTags(args);
  }

  queryAllTags() : Observable<QueryItem[]>
  {
    if(this.cachedTags.length > 0)
    {
      return of(this.cachedTags);
    }
    let url = this.apiUrl + 'tag/query/all';
    return this.http.get<QueryItem[]>(url).pipe(timeout(this.dataTimeout), tap(data => this.cachedTags = data));
  }
  tagAllCallback = (): Observable<QueryItem[]> => 
  {
    return this.queryAllTags();
  }

  //Pokemon

  queryPokemonsByName(key: string | null) : Observable<QueryItem[]>
  {
    if(!key) 
    {
      this.cachedPokemon = [];
      return of([]);
    }
    if(this.cachedPokemon.length > 0)
    {
      const filteredItems: QueryItem[] = this.filterNameStartsWith(key, this.cachedPokemon)
      if(filteredItems.length > 0)
      {
        return of(filteredItems);
      }
      return of([]);
    }
    let url = this.apiUrl + 'pokemon/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryItem[]>(url, {params: params}).pipe(timeout(this.dataTimeout), tap(data => this.cachedPokemon = data));
  }
  queryPokemonCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryPokemonsByName(args);
  }

  queryItemsByName(key: string) : Observable<QueryItem[]>
  {
    if(!key) 
    {
      this.cachedItems = [];
      return of([]);
    }
    if(this.cachedItems.length > 0)
    {
      const filteredItems: QueryItem[] = this.filterNameStartsWith(key, this.cachedItems)
      if(filteredItems.length > 0)
      {
        return of(filteredItems);
      }
      return of([]);
    }
    let url = this.apiUrl + 'item/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryItem[]>(url, {params: params}).pipe(timeout(this.dataTimeout), tap(data => this.cachedItems = data));
  }
  queryItemCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryItemsByName(args);
  }

  queryMovesByName(key: string) : Observable<QueryItem[]>
  {
    if(!key) 
    {
      this.cachedMoves = [];
      return of([]);
    }
    if(this.cachedMoves.length > 0)
    {
      const filteredItems: QueryItem[] = this.filterNameStartsWith(key, this.cachedMoves)
      if(filteredItems.length > 0)
      {
        return of(filteredItems);
      }
      return of([]);
    }
    let url = this.apiUrl + 'move/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryItem[]>(url, {params: params}).pipe(timeout(this.dataTimeout), tap(data => this.cachedMoves = data));
  }
  queryMoveCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryMovesByName(args);
  }

  queryAbilitiesByName(key: string) : Observable<QueryItem[]>
  {
    if(!key) 
    {
      this.cachedAbilities = [];
      return of([]);
    }
    if(this.cachedAbilities.length > 0)
    {
      const filteredItems: QueryItem[] = this.filterNameStartsWith(key, this.cachedAbilities)
      if(filteredItems.length > 0)
      {
        return of(filteredItems);
      }
      return of([]);
    }
    let url = this.apiUrl + 'ability/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryItem[]>(url, {params: params}).pipe(timeout(this.dataTimeout), tap(data => this.cachedAbilities = data));
  }
  queryAbilityCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryAbilitiesByName(args);
  }

  queryAllAbilities() : Observable<QueryItem[]>
  {
    if(this.cachedAbilities.length > 0)
    {
      return of(this.cachedAbilities);
    }
    let url = this.apiUrl + 'ability/all';
    return this.http.get<QueryItem[]>(url).pipe(timeout(this.dataTimeout), tap(data => this.cachedAbilities = data));
  }
  abilityAllCallback = (): Observable<QueryItem[]> => 
  {
    return this.queryAllAbilities();
  }

  queryPokemonAbilities(id: number) : Observable<QueryItem[]>
  {
    let url = this.apiUrl + 'ability/pokemon/' + id;
    return this.http.get<QueryItem[]>(url).pipe(timeout(this.dataTimeout));
  }
  pokemonAbilitiesCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryPokemonAbilities(args);
  }
  
  queryNaturesByName(key: string) : Observable<QueryItem[]>
  {
    if(!key) 
    {
      return of(this.cachedNatures);
    }
    if(this.cachedNatures.length > 0)
    {
      const filteredItems: QueryItem[] = this.filterNameIncludes(key, this.cachedNatures)
      if(filteredItems.length > 0)
      {
        return of(filteredItems);
      }
      return of([]);
    }
    let url = this.apiUrl + 'nature/query';
    let params = new HttpParams().set('key', key ?? "");
    return this.http.get<QueryItem[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryNatureCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryNaturesByName(args);
  }

  queryAllNatures() : Observable<QueryItem[]>
  {
    if(this.cachedNatures.length > 0)
    {
      return of(this.cachedNatures);
    }
    let url = this.apiUrl + 'nature/query/all';
    return this.http.get<QueryItem[]>(url).pipe(timeout(this.dataTimeout), tap(data => this.cachedNatures = data));
  }
  naturesAllCallback = (): Observable<QueryItem[]> => 
  {
    return this.queryAllNatures();
  }

  queryTeraTypesByName(key: string) : Observable<QueryItem[]>
  {
    if(this.cachedTeratypes)
    {
      return of(this.filterNameStartsWith(key, this.cachedTeratypes));
    }
    let url = this.apiUrl + 'type/teratype/query';
    let params = new HttpParams().set('key', key ?? "");
    return this.http.get<QueryItem[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryTeratypeCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryTeraTypesByName(args);
  }

  queryAllTeraTypes() : Observable<QueryItem[]>
  {
    if(this.cachedNatures.length > 0)
    {
      return of(this.cachedNatures);
    }
    let url = this.apiUrl + 'type/teratype/query/all';
    return this.http.get<QueryItem[]>(url).pipe(timeout(this.dataTimeout), tap(data => this.cachedNatures = data));
  }
  teraTypesAllCallback = (): Observable<QueryItem[]> => 
  {
    return this.queryAllTeraTypes();
  }

  //Converters

  getPokemonQueryResult(pokemon: Pokemon)
  {
    if(pokemon.name)
    {
      let queryResult: QueryItem = 
      {
        name: pokemon.name.content ?? "",
        identifier: pokemon.pokemonId?.toString() ?? "",
        icon: pokemon.sprite?.base,
        type: "pokemon"
      }
      return queryResult;
    }
    return undefined;
  }

  getMoveQueryResult(move?: Move): QueryItem | undefined
  {
    if(move)
    {
      return {
        name: move.name.content,
        identifier: move.name.content,
        icon: move.pokeType?.iconPath,
        type: "move"
      }
    }
    return undefined;
  }

  getItemQueryResult(item?: Item): QueryItem | undefined
  {
    if(item)
    {
      return {
        name: item.name.content,
        identifier: item.name.content,
        icon: item.iconPath,
        type: "item"
      }
    }
    return undefined;
  }

  getAbilityQueryResult(ability?: Ability): QueryItem | undefined
  {
    if(ability)
    {
      return {
        name: ability.name.content,
        identifier: ability.name.content,
        icon: ability.hidden ? "hidden" : undefined,
        type: "ability"
      }
    }
    return undefined;
  }

  getNatureQueryResult(nature?: Nature): QueryItem | undefined
  {
    if(nature)
    {
      return {
        name: nature.name.content,
        identifier: nature.name.content,
        type: "nature"
      }
    }
    return undefined;
  }

  getTypeQueryResult(type?: Type): QueryItem | undefined
  {
    if(type)
    {
      return {
        name: type.name.content,
        identifier: type.name.content,
        icon: type.iconPath,
        type: "type"
      }
    }
    return undefined;
  }

  getTournamentQueryResult(tournament?: Tournament): QueryItem | undefined
  {
    if(tournament)
    {
      return {
        name: tournament.name,
        identifier: tournament.name,
        icon: tournament.icon,
        type: "tournament"
      }
    }
    return undefined;
  }

  getRegulationQueryResult(regulation?: Regulation): QueryItem | undefined
  {
    if(regulation)
    {
      return {
        name: regulation.name,
        identifier: regulation.identifier,
        type: "regulation"
      }
    }
    return undefined;
  }
}
