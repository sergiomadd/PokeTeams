import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import {HttpParams} from "@angular/common/http";
import { Observable } from 'rxjs';
import { PokemonData } from '../models/pokemonData.model';


@Injectable({
  providedIn: 'root'
})
export class HttpService 
{

  private url = 'https://my-json-server.typicode.com/JSGund/XHR-Fetch-Request-JavaScript/posts';
  private apiUrl = 'https://localhost:7134/api/';

  constructor(private http: HttpClient) 
  {

  }

  getPosts() 
  {
    return this.http.get(this.url);
  }

  getPokemon(name: string) : Observable<PokemonData>
  {
    /*
    Use if api uses api/pokemon/?pokemonName=Metagross
    Instead of api/pokemon/metagross
    let poke = 'Metagross';
    let url = this.apiUrl + 'pokemon/';
    let params = new HttpParams().set("pokemonName", poke);
    return this.http.get(url, {params: params});
    */
    let url = this.apiUrl + 'pokemon/' + name;

    return this.http.get<PokemonData>(url);
  }

}
