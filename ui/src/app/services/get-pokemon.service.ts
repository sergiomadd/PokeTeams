import { Injectable } from '@angular/core';
import { PokemonData } from '../models/pokemonData.model';
import { HttpClient } from  '@angular/common/http';
import { Pokemon } from '../models/pokemon.model';
import { PokePasteData } from '../models/pokePasteData.model';
import { Observable, lastValueFrom, map } from 'rxjs';
import { Ability } from '../models/ability.model';
import { Item } from '../models/item.model';
import { Move } from '../models/move.model';
import { Nature } from '../models/nature.model';
import { Stat } from '../models/stat.model';
import { getErrorMessage } from './util';
import { Type } from '../models/type.model';


@Injectable({
  providedIn: 'root'
})
export class GetPokemonService 
{
  private apiUrl = 'https://localhost:7134/api/';

  constructor(private http: HttpClient) 
  {

  }

  async buildPokemon(paste: PokePasteData) : Promise<Pokemon[]>
  {
    let pokemons: Pokemon[] = [];
    paste.pokemons.forEach(async (pokePaste) => 
    {
      let pokemon: Pokemon = <Pokemon>{};
      let pokemonData: PokemonData = await this.getPokemon(pokePaste.name);
      
      pokemon.name = pokemonData.name;
      pokemon.nickname = pokePaste.nickname;
      pokemon.dexNumber = pokemonData.dexNumber;
      pokemon.types = pokemonData.types;
      pokemon.teraType = pokePaste.teratype ? await this.getType(pokePaste.teratype) : undefined;
      pokemon.item = pokePaste.item ? await this.getItem(pokePaste.item) : undefined; 
      pokemon.ability = pokePaste.ability ? await this.getAbility(pokePaste.ability) : undefined;
      pokemon.nature = pokePaste.nature ? await this.getNature(pokePaste.nature) : undefined;
      pokemon.moves = pokePaste.moves ? await this.getMoves(pokePaste.moves) : undefined;
      pokemon.stats = pokemonData.stats;
      pokemon.ivs = pokePaste.ivs ? await this.createStats(pokePaste.ivs) : undefined;
      pokemon.evs = pokePaste.evs ? await this.createStats(pokePaste.evs) : undefined;
      pokemon.level = pokePaste.level ? pokePaste.level : undefined;
      pokemon.shiny = pokePaste.shiny ? pokePaste.shiny : undefined;
      pokemon.gender = pokePaste.gender ? pokePaste.gender : undefined;

      console.log('Generated pokemon: ', pokemon);
      pokemons.push(pokemon);
    });
    return pokemons;
  }

  /*
  Use if api uses api/pokemon/?pokemonName=Metagross
  Instead of api/pokemon/metagross
  let poke = 'Metagross';
  let url = this.apiUrl + 'pokemon/';
  let params = new HttpParams().set("pokemonName", poke);
  return this.http.get(url, {params: params});
  */
  async getPokemon(name: string) : Promise<PokemonData>
  {
    let pokemonData: PokemonData = <PokemonData>{}
    let url = this.apiUrl + 'pokemon/' + name;
    try
    {
      const pokemonData$ = this.http.get<PokemonData>(url);
      pokemonData = await lastValueFrom(pokemonData$);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return pokemonData;
  }

  async getItem(name: string) : Promise<Item>
  {
    let item: Item = <Item>{}
    let url = this.apiUrl + 'item/' + name;
    try
    {
      const item$ = this.http.get<Item>(url);
      item = await lastValueFrom(item$);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return item;
  }

  async getAbility(name: string) : Promise<Ability>
  {
    let ability: Ability = <Ability>{}
    let url = this.apiUrl + 'ability/' + name;
    try
    {
      const ability$ = this.http.get<Ability>(url);
      ability = await lastValueFrom(ability$);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return ability; 
  }

  async getNature(name: string) : Promise<Nature>
  {
    let nature: Nature = <Nature>{}
    let url = this.apiUrl + 'nature/' + name;
    try
    {
      const nature$ = this.http.get<Nature>(url);
      nature = await lastValueFrom(nature$);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return nature;
  }

  async getMove(name: string) : Promise<Move>
  {
    let move: Move = <Move>{}
    let url = this.apiUrl + 'move/' + name;
    try
    {
      const move$ = this.http.get<Move>(url);
      move = await lastValueFrom(move$);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return move;
  }

  getMoves(movesData: string[]) : Move[]
  {
    let moves: Move[] = []
    movesData.forEach(async move => 
    {
      moves.push(await this.getMove(move));
    });
    return moves;
  }

  async getType(typeName: string) : Promise<Type>
  {
    console.log('type',typeName)
    let type: Type = <Type>{};
    let url = this.apiUrl + 'type/' + typeName;
    this.http.get<Type>(url).subscribe
    try
    {
      const typeName$ = this.http.get<Type>(url);
      type = await lastValueFrom(typeName$);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return type;
  }

  async getStatName(identifier: string) : Promise<string>
  {
    let statName: string = '';
    let url = this.apiUrl + 'stat/' + identifier;
    this.http.get<string>(url).subscribe
    try
    {
      const statName$ = this.http.get(url, {responseType: 'text'});
      statName = await lastValueFrom(statName$);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return statName;
  }

  createStats(statsData :string[][]) : Stat[]
  {
    let statIdentifiers = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];
    let stats: Stat[] = [];
    statsData.forEach(async statData => 
    {
      let stat: Stat = <Stat>{}
      stat.identifier = statData[0];
      stat.name = (await this.getStatName(statData[0]));
      stat.stat = Number(statData[1]);
      let index: number = statIdentifiers.indexOf(statData[0]);
      stats.splice(index, 0, stat); //instead of push to keep stats ordered after http get
    });
    return stats;
  }
} 
