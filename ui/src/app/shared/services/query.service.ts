import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, timeout } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { QueryResult } from '../models/queryResult.model';

@Injectable({
  providedIn: 'root'
})
export class QueryService 
{
  private apiUrl = environment.apiURL;
  private dataTimeout = 2000;
  
  constructor(private http: HttpClient) { }

  //User
 
  queryUser(key: string): Observable<QueryResult[]>
  {
    let url = this.apiUrl + "query";
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryResult[]>(url, {params: params, withCredentials: true}).pipe(timeout(this.dataTimeout));
  }
  queryUserCallback = (args: any): Observable<QueryResult[]> => 
  {
    return this.queryUser(args);
  }

  queryCountriesByName(key: string) : Observable<QueryResult[]>
  {
    let url = this.apiUrl + 'countries/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryResult[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryCountriesCallback = (args: any): Observable<QueryResult[]> => 
  {
    return this.queryCountriesByName(args);
  }

  getAllCountries() : Observable<QueryResult[]>
  {
    let url = this.apiUrl + "countries/all";
    return this.http.get<QueryResult[]>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }
  countriesAllCallback = (): Observable<QueryResult[]> => 
  {
    return this.getAllCountries();
  }

  //Team
  
  queryTournamentsByName(key: string) : Observable<QueryResult[]>
  {
    let url = this.apiUrl + 'tournament/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryResult[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryTournamentCallback = (args: any): Observable<QueryResult[]> => 
  {
    return this.queryTournamentsByName(args);
  }

  queryRegulation = (args: any): Observable<QueryResult[]> => 
  {
    let url = this.apiUrl + 'regulation/query/all';
    return this.http.get<QueryResult[]>(url).pipe(timeout(this.dataTimeout), 
    map((QueryResults: QueryResult[]) => QueryResults.filter(t => 
      {
        return t.name.toLowerCase().includes(args.toLowerCase())
      }))
    );
  }
  queryRegulationCallback = (args: any): Observable<QueryResult[]> => 
  {
    return this.queryRegulationCallback(args);
  }

  queryAllRegulations() : Observable<QueryResult[]>
  {
    let url = this.apiUrl + 'regulation/query/all';
    return this.http.get<QueryResult[]>(url).pipe(timeout(this.dataTimeout));
  }
  regulationAllCallback = (): Observable<QueryResult[]> => 
  {
    return this.queryAllRegulations();
  }

  queryTags = (args: any): Observable<QueryResult[]> => 
  {
    let url = this.apiUrl + 'QueryResult/all';
    return this.http.get<QueryResult[]>(url).pipe(timeout(this.dataTimeout), 
    map((QueryResults: QueryResult[]) => QueryResults.filter(t => 
      {
        return t.name.toLowerCase().includes(args.toLowerCase())
      }))
    );
  }
  queryTagCallback = (args: any): Observable<QueryResult[]> => 
  {
    return this.queryTags(args);
  }

  queryAllTags() : Observable<QueryResult[]>
  {
    let url = this.apiUrl + 'QueryResult/all';
    return this.http.get<QueryResult[]>(url).pipe(timeout(this.dataTimeout));
  }
  tagAllCallback = (): Observable<QueryResult[]> => 
  {
    return this.queryAllTags();
  }

  //Pokemon

  queryPokemonsByName(key: string) : Observable<QueryResult[]>
  {
    let url = this.apiUrl + 'pokemon/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryResult[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryPokemonCallback = (args: any): Observable<QueryResult[]> => 
  {
    return this.queryPokemonsByName(args);
  }

  queryItemsByName(key: string) : Observable<QueryResult[]>
  {
    let url = this.apiUrl + 'item/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryResult[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryItemCallback = (args: any): Observable<QueryResult[]> => 
  {
    return this.queryItemsByName(args);
  }

  queryMovesByName(key: string) : Observable<QueryResult[]>
  {
    let url = this.apiUrl + 'move/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryResult[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryMoveCallback = (args: any): Observable<QueryResult[]> => 
  {
    return this.queryMovesByName(args);
  }

  queryAbilitiesByName(key: string) : Observable<QueryResult[]>
  {
    let url = this.apiUrl + 'ability/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryResult[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryAbilityCallback = (args: any): Observable<QueryResult[]> => 
  {
    return this.queryAbilitiesByName(args);
  }

  queryAllAbilities() : Observable<QueryResult[]>
  {
    let url = this.apiUrl + 'ability/all';
    return this.http.get<QueryResult[]>(url).pipe(timeout(this.dataTimeout));
  }
  abilityAllCallback = (): Observable<QueryResult[]> => 
  {
    return this.queryAllAbilities();
  }

  queryPokemonAbilities(id: number) : Observable<QueryResult[]>
  {
    let url = this.apiUrl + 'ability/pokemon/' + id;
    return this.http.get<QueryResult[]>(url).pipe(timeout(this.dataTimeout));
  }
  pokemonAbilitiesCallback = (args: any): Observable<QueryResult[]> => 
  {
    return this.queryPokemonAbilities(args);
  }
  
  queryNaturesByName(key: string) : Observable<QueryResult[]>
  {
    let url = this.apiUrl + 'nature/query';
    let params = new HttpParams().set('key', key ?? "");
    return this.http.get<QueryResult[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryNatureCallback = (args: any): Observable<QueryResult[]> => 
  {
    return this.queryNaturesByName(args);
  }

  queryAllNatures() : Observable<QueryResult[]>
  {
    let url = this.apiUrl + 'nature/query/all';
    return this.http.get<QueryResult[]>(url).pipe(timeout(this.dataTimeout));
  }
  naturesAllCallback = (): Observable<QueryResult[]> => 
  {
    return this.queryAllNatures();
  }

  queryTeraTypesByName(key: string) : Observable<QueryResult[]>
  {
    let url = this.apiUrl + 'type/teratype/query';
    let params = new HttpParams().set('key', key ?? "");
    return this.http.get<QueryResult[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryTeratypeCallback = (args: any): Observable<QueryResult[]> => 
  {
    return this.queryTeraTypesByName(args);
  }

  queryAllTeraTypes() : Observable<QueryResult[]>
  {
    let url = this.apiUrl + 'type/teratype/query/all';
    return this.http.get<QueryResult[]>(url).pipe(timeout(this.dataTimeout));
  }
  teraTypesAllCallback = (): Observable<QueryResult[]> => 
  {
    return this.queryAllTeraTypes();
  }
}
