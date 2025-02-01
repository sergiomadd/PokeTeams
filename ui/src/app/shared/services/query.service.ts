import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, timeout } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Tag } from '../../features/team/models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class QueryService 
{
  private apiUrl = environment.apiURL;
  private dataTimeout = 2000;
  
  constructor(private http: HttpClient) { }

  //User
 
  queryUser(key: string): Observable<Tag[]>
  {
    let url = this.apiUrl + "query";
    let params = new HttpParams().set('key', key);
    return this.http.get<Tag[]>(url, {params: params, withCredentials: true}).pipe(timeout(this.dataTimeout));
  }
  queryUserCallback = (args: any): Observable<Tag[]> => 
  {
    return this.queryUser(args);
  }

  queryCountriesByName(key: string) : Observable<Tag[]>
  {
    let url = this.apiUrl + 'countries/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<Tag[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryCountriesCallback = (args: any): Observable<Tag[]> => 
  {
    return this.queryCountriesByName(args);
  }

  getAllCountries() : Observable<Tag[]>
  {
    let url = this.apiUrl + "countries/all";
    return this.http.get<Tag[]>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }
  countriesAllCallback = (): Observable<Tag[]> => 
  {
    return this.getAllCountries();
  }

  //Team
  
  queryTournamentsByName(key: string) : Observable<Tag[]>
  {
    let url = this.apiUrl + 'tournament/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<Tag[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryTournamentCallback = (args: any): Observable<Tag[]> => 
  {
    return this.queryTournamentsByName(args);
  }

  queryRegulation = (args: any): Observable<Tag[]> => 
  {
    let url = this.apiUrl + 'regulation/query/all';
    return this.http.get<Tag[]>(url).pipe(timeout(this.dataTimeout), 
    map((tags: Tag[]) => tags.filter(t => 
      {
        return t.name.toLowerCase().includes(args.toLowerCase())
      }))
    );
  }
  queryRegulationCallback = (args: any): Observable<Tag[]> => 
  {
    return this.queryRegulationCallback(args);
  }

  queryAllRegulations() : Observable<Tag[]>
  {
    let url = this.apiUrl + 'regulation/query/all';
    return this.http.get<Tag[]>(url).pipe(timeout(this.dataTimeout));
  }
  regulationAllCallback = (): Observable<Tag[]> => 
  {
    return this.queryAllRegulations();
  }

  queryTag = (args: any): Observable<Tag[]> => 
  {
    let url = this.apiUrl + 'tag/all';
    return this.http.get<Tag[]>(url).pipe(timeout(this.dataTimeout), 
    map((tags: Tag[]) => tags.filter(t => 
      {
        return t.name.toLowerCase().includes(args.toLowerCase())
      }))
    );
  }
  queryTagCallback = (args: any): Observable<Tag[]> => 
  {
    return this.queryTag(args);
  }

  getAllTags() : Observable<Tag[]>
  {
    let url = this.apiUrl + 'tag/all';
    return this.http.get<Tag[]>(url).pipe(timeout(this.dataTimeout));
  }
  tagAllCallback = (): Observable<Tag[]> => 
  {
    return this.getAllTags();
  }

  //Pokemon

  queryPokemonsByName(key: string) : Observable<Tag[]>
  {
    let url = this.apiUrl + 'pokemon/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<Tag[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryPokemonCallback = (args: any): Observable<Tag[]> => 
  {
    return this.queryPokemonsByName(args);
  }

  queryItemsByName(key: string) : Observable<Tag[]>
  {
    let url = this.apiUrl + 'item/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<Tag[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryItemCallback = (args: any): Observable<Tag[]> => 
  {
    return this.queryItemsByName(args);
  }

  queryMovesByName(key: string) : Observable<Tag[]>
  {
    let url = this.apiUrl + 'move/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<Tag[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryMoveCallback = (args: any): Observable<Tag[]> => 
  {
    return this.queryMovesByName(args);
  }

  queryAbilitiesByName(key: string) : Observable<Tag[]>
  {
    let url = this.apiUrl + 'ability/query';
    let params = new HttpParams().set('key', key);
    return this.http.get<Tag[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryAbilityCallback = (args: any): Observable<Tag[]> => 
  {
    return this.queryAbilitiesByName(args);
  }

  queryAllAbilities() : Observable<Tag[]>
  {
    let url = this.apiUrl + 'ability/all';
    return this.http.get<Tag[]>(url).pipe(timeout(this.dataTimeout));
  }
  abilityAllCallback = (): Observable<Tag[]> => 
  {
    return this.queryAllAbilities();
  }

  queryPokemonAbilities(id: number) : Observable<Tag[]>
  {
    let url = this.apiUrl + 'ability/pokemon/' + id;
    return this.http.get<Tag[]>(url).pipe(timeout(this.dataTimeout));
  }
  pokemonAbilitiesCallback = (args: any): Observable<Tag[]> => 
  {
    return this.queryPokemonAbilities(args);
  }
  
  queryNaturesByName(key: string) : Observable<Tag[]>
  {
    let url = this.apiUrl + 'nature/query';
    let params = new HttpParams().set('key', key ?? "");
    return this.http.get<Tag[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryNatureCallback = (args: any): Observable<Tag[]> => 
  {
    return this.queryNaturesByName(args);
  }

  queryAllNatures() : Observable<Tag[]>
  {
    let url = this.apiUrl + 'nature/query/all';
    return this.http.get<Tag[]>(url).pipe(timeout(this.dataTimeout));
  }
  naturesAllCallback = (): Observable<Tag[]> => 
  {
    return this.queryAllNatures();
  }

  queryTeraTypesByName(key: string) : Observable<Tag[]>
  {
    let url = this.apiUrl + 'type/teratype/query';
    let params = new HttpParams().set('key', key ?? "");
    return this.http.get<Tag[]>(url, {params: params}).pipe(timeout(this.dataTimeout));
  }
  queryTeratypeCallback = (args: any): Observable<Tag[]> => 
  {
    return this.queryTeraTypesByName(args);
  }

  queryAllTeraTypes() : Observable<Tag[]>
  {
    let url = this.apiUrl + 'type/teratype/query/all';
    return this.http.get<Tag[]>(url).pipe(timeout(this.dataTimeout));
  }
  teraTypesAllCallback = (): Observable<Tag[]> => 
  {
    return this.queryAllTeraTypes();
  }
}
