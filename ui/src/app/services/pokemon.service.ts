import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, lastValueFrom, timeout } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { defaultPokemonData, PokemonData } from '../models/DTOs/pokemonData.dto';
import { Ability, defaultAbility } from '../models/pokemon/ability.model';
import { DefaultItem, Item } from '../models/pokemon/item.model';
import { defaultMove, Move } from '../models/pokemon/move.model';
import { defaultNature, Nature } from '../models/pokemon/nature.model';
import { Pokemon } from '../models/pokemon/pokemon.model';
import { Stat } from '../models/pokemon/stat.model';
import { Type } from '../models/pokemon/type.model';
import { defaultTypeWithEffectiveness, TypeWithEffectiveness } from '../models/pokemon/typewitheffectiveness.model';
import { PokePaste } from '../models/pokePaste.model';
import { Tag } from '../models/tag.model';
import { LinkifierService } from './linkifier.service';
import { getErrorMessage } from './util';


@Injectable({
  providedIn: 'root'
})
export class PokemonService 
{
  linkifier = inject(LinkifierService);

  private apiUrl = environment.apiURL;
  private dataTimeout = 2000;

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
      const teraTypePromise: Promise<TypeWithEffectiveness> | undefined = pokePaste.teratype ? this.getType(pokePaste.teratype, true) : undefined;
      const itemPromise: Promise<Item> | undefined = pokePaste.item ? this.getItemByName(pokePaste.item) : undefined;
      const abilityPromise: Promise<Ability> | undefined = pokePaste.ability ? this.getAbilityByName(pokePaste.ability) : undefined;
      const naturePromise: Promise<Nature> | undefined = pokePaste.nature ? this.getNatureByName(pokePaste.nature) : undefined;
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
      pokemonData = await lastValueFrom(this.http.get<PokemonData>(url).pipe(catchError(() => [defaultPokemonData]), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return pokemonData;
  }

  async getItemByName(name: string) : Promise<Item>
  {
    let item: Item = <Item>{}
    let url = this.apiUrl + 'item/name/' + name;
    try
    {
      item = await lastValueFrom(this.http.get<Item>(url).pipe(catchError(() => [DefaultItem]), timeout(this.dataTimeout)));
      item.prose = this.linkifier.linkifyProse(item.prose);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return item;
  }

  async getAbilityByName(name: string) : Promise<Ability>
  {
    let ability: Ability = <Ability>{}
    let url = this.apiUrl + 'ability/name/' + name;
    try
    {
      ability = await lastValueFrom(this.http.get<Ability>(url).pipe(catchError(() => [defaultAbility]), timeout(this.dataTimeout)));
      ability.prose = this.linkifier.linkifyProse(ability.prose);
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return ability; 
  }

  async getNatureByName(name: string) : Promise<Nature>
  {
    let nature: Nature = <Nature>{}
    let url = this.apiUrl + 'nature/name/' + name;
    try
    {
      nature = await lastValueFrom(this.http.get<Nature>(url).pipe(catchError(() => [defaultNature]), timeout(this.dataTimeout)));
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
      move = await lastValueFrom(this.http.get<Move>(url).pipe(catchError(() => [defaultMove]), timeout(this.dataTimeout)));
      move.effect ? move.effect.short = this.linkifier.linkifyProse(move.effect?.short) : null;
      move.effect ? move.effect.long = this.linkifier.linkifyProse(move.effect?.long) : null;
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return move;
  }

  async getType(typeName: string, teratype?: boolean) : Promise<TypeWithEffectiveness>
  {
    let type: TypeWithEffectiveness = <TypeWithEffectiveness>{};
    let url = this.apiUrl + 'type/' + (teratype ? 'teratype/' : '') + typeName;
    this.http.get<TypeWithEffectiveness>(url).subscribe
    try
    {
      type = await lastValueFrom(this.http.get<TypeWithEffectiveness>(url).pipe(catchError(() => [defaultTypeWithEffectiveness]), timeout(this.dataTimeout)));
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
      statName = await lastValueFrom(this.http.get(url, {responseType: 'text'}).pipe(catchError(() => ["Not Found"]), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return statName;
  }

  async queryPokemonsByName(key: string) : Promise<Tag[]>
  {
    let pokemons: Tag[] = [];
    let url = this.apiUrl + 'pokemon/query';
    try
    {
      let params = new HttpParams().set('key', key ?? "");
      pokemons = await lastValueFrom(this.http.get<Tag[]>(url, {params: params})
      .pipe(catchError(() => []), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return pokemons; 
  }

  async queryMovesByName(key: string) : Promise<Tag[]>
  {
    let moves: Tag[] = [];
    let url = this.apiUrl + 'move/query';
    try
    {
      let params = new HttpParams().set('key', key ?? "");
      moves = await lastValueFrom(this.http.get<Tag[]>(url, {params: params})
      .pipe(catchError(() => []), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return moves; 
  }

  async queryItemsByName(key: string) : Promise<Tag[]>
  {
    let items: Tag[] = [];
    let url = this.apiUrl + 'item/query';
    try
    {
      let params = new HttpParams().set('key', key ?? "");
      items = await lastValueFrom(this.http.get<Tag[]>(url, {params: params})
      .pipe(catchError(() => []), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return items; 
  }

  async queryAbilitiesByName(key: string) : Promise<Tag[]>
  {
    let abilities: Tag[] = [];
    let url = this.apiUrl + 'ability/query';
    try
    {
      let params = new HttpParams().set('key', key ?? "");
      abilities = await lastValueFrom(this.http.get<Tag[]>(url, {params: params})
      .pipe(catchError(() => []), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return abilities; 
  }


  async queryNaturesByName(key: string) : Promise<Tag[]>
  {
    let natures: Tag[] = [];
    let url = this.apiUrl + 'nature/query';
    try
    {
      let params = new HttpParams().set('key', key ?? "");
      natures = await lastValueFrom(this.http.get<Tag[]>(url, {params: params})
      .pipe(catchError(() => []), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return natures; 
  }
  async getAllNatures() : Promise<Nature[]>
  {
    let regulations: Nature[] = [];
    let url = this.apiUrl + 'nature/all';
    try
    {
      regulations = await lastValueFrom(this.http.get<Nature[]>(url)
      .pipe(catchError(() => []), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return regulations; 
  }

  async queryTeraTypesByName(key: string) : Promise<Tag[]>
  {
    let teraTypes: Tag[] = [];
    let url = this.apiUrl + 'type/teratype/query';
    try
    {
      let params = new HttpParams().set('key', key ?? "");
      teraTypes = await lastValueFrom(this.http.get<Tag[]>(url, {params: params})
      .pipe(catchError(() => []), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return teraTypes; 
  }
  async getAllTeraTypes() : Promise<Type[]>
  {
    let types: Type[] = [];
    let url = this.apiUrl + 'type/teratype/all';
    try
    {
      types = await lastValueFrom(this.http.get<Type[]>(url)
      .pipe(catchError(() => []), timeout(this.dataTimeout)));
    }
    catch(error)
    {
      console.log("Error: ", getErrorMessage(error));
    }
    return types; 
  }
} 
