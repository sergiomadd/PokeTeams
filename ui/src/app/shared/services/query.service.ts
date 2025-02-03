import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, timeout } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { QueryItem } from '../models/queryResult.model';

@Injectable({
  providedIn: 'root'
})
export class QueryService 
{
  private apiUrl = environment.apiURL;
  private dataTimeout = 2000;
  
  constructor(private http: HttpClient) { }

  //User
 
  queryUser(key: string): Observable<QueryItem[]>
  {
    let url = this.apiUrl + "query";
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryItem[]>(url, {params: params, withCredentials: true}).pipe(timeout(this.dataTimeout));
  }
  queryUserCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryUser(args);
  }

  queryCountriesByName(key: string) : Observable<QueryItem[]>
  {
    let url = this.apiUrl + 'countries/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryItem[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryCountriesCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryCountriesByName(args);
  }

  getAllCountries() : Observable<QueryItem[]>
  {
    let url = this.apiUrl + "countries/all";
    return this.http.get<QueryItem[]>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }
  countriesAllCallback = (): Observable<QueryItem[]> => 
  {
    return this.getAllCountries();
  }

  //Team
  
  queryTournamentsByName(key: string) : Observable<QueryItem[]>
  {
    let url = this.apiUrl + 'tournament/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryItem[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryTournamentCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryTournamentsByName(args);
  }

  queryRegulation = (args: any): Observable<QueryItem[]> => 
  {
    let url = this.apiUrl + 'regulation/query/all';
    return this.http.get<QueryItem[]>(url).pipe(timeout(this.dataTimeout), 
    map((QueryResults: QueryItem[]) => QueryResults.filter(t => 
      {
        return t.name.toLowerCase().includes(args.toLowerCase())
      }))
    );
  }
  queryRegulationCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryRegulationCallback(args);
  }

  queryAllRegulations() : Observable<QueryItem[]>
  {
    let url = this.apiUrl + 'regulation/query/all';
    return this.http.get<QueryItem[]>(url).pipe(timeout(this.dataTimeout));
  }
  regulationAllCallback = (): Observable<QueryItem[]> => 
  {
    return this.queryAllRegulations();
  }

  queryTags = (args: any): Observable<QueryItem[]> => 
  {
    let url = this.apiUrl + 'tag/all';
    return this.http.get<QueryItem[]>(url).pipe(timeout(this.dataTimeout), 
    map((QueryResults: QueryItem[]) => QueryResults.filter(t => 
      {
        return t.name.toLowerCase().includes(args.toLowerCase())
      }))
    );
  }
  queryTagCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryTags(args);
  }

  queryAllTags() : Observable<QueryItem[]>
  {
    let url = this.apiUrl + 'tag/all';
    return this.http.get<QueryItem[]>(url).pipe(timeout(this.dataTimeout));
  }
  tagAllCallback = (): Observable<QueryItem[]> => 
  {
    return this.queryAllTags();
  }

  //Pokemon

  queryPokemonsByName(key: string) : Observable<QueryItem[]>
  {
    let url = this.apiUrl + 'pokemon/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryItem[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryPokemonCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryPokemonsByName(args);
  }

  queryItemsByName(key: string) : Observable<QueryItem[]>
  {
    let url = this.apiUrl + 'item/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryItem[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryItemCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryItemsByName(args);
  }

  queryMovesByName(key: string) : Observable<QueryItem[]>
  {
    let url = this.apiUrl + 'move/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryItem[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryMoveCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryMovesByName(args);
  }

  queryAbilitiesByName(key: string) : Observable<QueryItem[]>
  {
    let url = this.apiUrl + 'ability/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<QueryItem[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryAbilityCallback = (args: any): Observable<QueryItem[]> => 
  {
    return this.queryAbilitiesByName(args);
  }

  queryAllAbilities() : Observable<QueryItem[]>
  {
    let url = this.apiUrl + 'ability/all';
    return this.http.get<QueryItem[]>(url).pipe(timeout(this.dataTimeout));
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
    let url = this.apiUrl + 'nature/query/all';
    return this.http.get<QueryItem[]>(url).pipe(timeout(this.dataTimeout));
  }
  naturesAllCallback = (): Observable<QueryItem[]> => 
  {
    return this.queryAllNatures();
  }

  queryTeraTypesByName(key: string) : Observable<QueryItem[]>
  {
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
    let url = this.apiUrl + 'type/teratype/query/all';
    return this.http.get<QueryItem[]>(url).pipe(timeout(this.dataTimeout));
  }
  teraTypesAllCallback = (): Observable<QueryItem[]> => 
  {
    return this.queryAllTeraTypes();
  }
}
