import { Injectable, inject } from '@angular/core';
import { PokemonData } from '../models/pokemonData.model';
import { HttpClient } from  '@angular/common/http';
import { Pokemon } from '../models/pokemon.model';
import { lastValueFrom, timeout } from 'rxjs';
import { Ability } from '../models/ability.model';
import { Item } from '../models/item.model';
import { Move } from '../models/move.model';
import { Nature } from '../models/nature.model';
import { Stat } from '../models/stat.model';
import { getErrorMessage } from './util';
import { Type } from '../models/type.model';
import { PokePaste } from '../models/pokePaste.model';
import { LinkifierService } from './linkifier.service';


@Injectable({
  providedIn: 'root'
})
export class GetPokemonService 
{
  private apiUrl = 'https://localhost:7134/api/';

  linkifier = inject(LinkifierService);

  constructor(private http: HttpClient) 
  {

  }

  async buildPokemon(pokePaste: PokePaste) : Promise<Pokemon>
  {
    //const now = new Date().getTime();
    let pokemon: Pokemon = <Pokemon>{};
    try 
    {
      
      const pokemonDataPromise: Promise<PokemonData> | undefined = pokePaste.name ? this.getPokemon(pokePaste.name) : undefined;
      const teraTypePromise: Promise<Type> | undefined = pokePaste.teratype ? this.getType(pokePaste.teratype, true) : undefined;
      const itemPromise: Promise<Item> | undefined = pokePaste.item ? this.getItem(pokePaste.item) : undefined;
      const abilityPromise: Promise<Ability> | undefined = pokePaste.ability ? this.getAbility(pokePaste.ability) : undefined;
      const naturePromise: Promise<Nature> | undefined = pokePaste.nature ? this.getNature(pokePaste.nature) : undefined;
      const movesPromise: Promise<Move[]> | undefined = pokePaste.moves ? this.getMoves(pokePaste.moves) : undefined;
      const ivsPromise: Promise<Stat[]> | undefined = pokePaste.ivs ? this.getStats(pokePaste.ivs) : undefined;
      const evsPromise: Promise<Stat[]> | undefined = pokePaste.evs ? this.getStats(pokePaste.evs) : undefined; 
      
      await Promise.allSettled([pokemonDataPromise, teraTypePromise, itemPromise, abilityPromise, naturePromise, movesPromise, ivsPromise, evsPromise])
      .then(([pokemonData, teraType, itemPromise, abilityPromise, naturePromise, movesPromise, ivsPromise, evsPromise]) => 
      {
        pokemon.name = pokemonData.status == "fulfilled" ? pokemonData.value?.name : '';
        pokemon.dexNumber = pokemonData.status == "fulfilled" ? pokemonData.value?.dexNumber : 0;
        pokemon.preEvolution = pokemonData.status == "fulfilled" ? pokemonData.value?.preEvolution : undefined;
        pokemon.evolutions = pokemonData.status == "fulfilled" ? pokemonData.value?.evolutions : undefined;
        pokemon.types = pokemonData.status == "fulfilled" ? pokemonData.value?.types : undefined;
        pokemon.stats = pokemonData.status == "fulfilled" ? pokemonData.value?.stats : [];
        pokemon.sprites = pokemonData.status == "fulfilled" ? pokemonData.value?.sprites : [];
        pokemon.nickname = pokePaste.nickname;
        pokemon.level = pokePaste.level ? pokePaste.level : 50;
        pokemon.shiny = pokePaste.shiny ? pokePaste.shiny : undefined;
        pokemon.gender = pokePaste.gender ? pokePaste.gender : undefined;
        pokemon.teraType = teraType.status == "fulfilled" ? teraType.value : undefined;
        pokemon.item = itemPromise.status == "fulfilled" ? itemPromise.value : undefined; 
        pokemon.ability = abilityPromise.status == "fulfilled" ? abilityPromise.value : undefined; 
        pokemon.nature = naturePromise.status == "fulfilled" ? naturePromise.value : undefined; 
        pokemon.moves = movesPromise.status == "fulfilled" ? movesPromise.value : undefined; 
        pokemon.ivs = ivsPromise.status == "fulfilled" ? ivsPromise.value : undefined; 
        pokemon.evs = evsPromise.status == "fulfilled" ? evsPromise.value : undefined; 
      });
    } 
    catch (error) 
    {
      console.log("Error getting pokemons.", error);
    }
    finally 
    {
      console.log('Generated pokemon: ', pokemon);
    }
    //console.log("Time to generate pokemon: ", new Date().getTime() - now);
    return pokemon;
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
      ability.prose = this.linkifier.linkify(ability.prose);
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

  async getMoves(movesData: string[]) : Promise<Move[]>
  {
    const movePromises: Promise<Move>[] = [];
    for (const moveData of movesData)
    {
      movePromises.push(this.getMove(moveData));
    }
    return await Promise.all(movePromises);
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

  async getType(typeName: string, teratype?: boolean) : Promise<Type>
  {
    let type: Type = <Type>{};
    let url = this.apiUrl + 'type/' + (teratype ? 'teratype/' : '') + typeName;
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

  async getStats(statsData: string[][]) : Promise<Stat[]>
  {
    const statPromises: Promise<Stat>[] = [];
    for (const statData of statsData)
    {
      statPromises.push(this.createStat(statData));
    }
    return await Promise.all(statPromises);
  }

  async createStat(statData: string[]) : Promise<Stat>
  {
    return this.getStatName(statData[0]).then((value) => 
    {
      let stat: Stat = <Stat>{}
      stat.identifier = statData[0];
      stat.name = value;
      stat.value = Number(statData[1]);
      return stat;
    })
  }

  async getStatName(identifier: string) : Promise<string>
  {
    let statName: string = '';
    let url = this.apiUrl + 'stat/' + identifier;
    try
    {
      const statName$ = this.http.get(url, {responseType: 'text'}).pipe(timeout(5000));
      statName = await lastValueFrom(statName$);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return statName;
  }
} 
