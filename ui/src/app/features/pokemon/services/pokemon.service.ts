import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, lastValueFrom, timeout } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { UtilService } from '../../../shared/services/util.service';
import { PokePaste } from '../../team/models/pokePaste.model';
import { Tag } from '../../team/models/tag.model';
import { Ability, defaultAbility } from '../models/ability.model';
import { DefaultItem, Item } from '../models/item.model';
import { defaultMove, Move } from '../models/move.model';
import { defaultNature, Nature } from '../models/nature.model';
import { Pokemon } from '../models/pokemon.model';
import { defaultPokemonData, PokemonData } from '../models/pokemonData.dto';
import { Stat } from '../models/stat.model';
import { Type } from '../models/type.model';
import { defaultTypeWithEffectiveness, TypeWithEffectiveness } from '../models/typewitheffectiveness.model';


@Injectable({
  providedIn: 'root'
})
export class PokemonService 
{
  util = inject(UtilService);

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
      const pokemonDataPromise: Promise<PokemonData> | undefined = pokePaste.name ? this.getPokemonData(pokePaste.name) : undefined;
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
        pokemon.name = pokemonData.status == "fulfilled" ? pokemonData.value?.name : undefined;
        pokemon.dexNumber = pokemonData.status == "fulfilled" ? pokemonData.value?.dexNumber : 0;
        pokemon.preEvolution = pokemonData.status == "fulfilled" ? pokemonData.value?.preEvolution : undefined;
        pokemon.evolutions = pokemonData.status == "fulfilled" ? pokemonData.value?.evolutions ?? [] : [];
        pokemon.types = pokemonData.status == "fulfilled" ? pokemonData.value?.types : undefined;
        pokemon.stats = pokemonData.status == "fulfilled" ? pokemonData.value?.stats ?? [] : [];
        pokemon.sprite = pokemonData.status == "fulfilled" ? pokemonData.value?.sprite : undefined;
        pokemon.nickname = pokePaste.nickname;
        pokemon.level = pokePaste.level ? pokePaste.level : 50;
        pokemon.shiny = pokePaste.shiny ? pokePaste.shiny : undefined;
        pokemon.gender = pokePaste.gender ? pokePaste.gender : undefined;
        pokemon.teraType = teraType.status == "fulfilled" ? teraType.value : undefined;
        pokemon.item = itemPromise.status == "fulfilled" ? itemPromise.value : undefined; 
        pokemon.ability = abilityPromise.status == "fulfilled" ? abilityPromise.value : undefined; 
        pokemon.nature = naturePromise.status == "fulfilled" ? naturePromise.value : undefined; 
        pokemon.moves = movesPromise.status == "fulfilled" ? movesPromise.value ?? [] : []; 
        pokemon.ivs = ivsPromise.status == "fulfilled" ? ivsPromise.value ?? [] : []; 
        pokemon.evs = evsPromise.status == "fulfilled" ? evsPromise.value ?? [] : []; 
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

  async getPokemonData(name: string) : Promise<PokemonData>
  {
    let pokemonData: PokemonData = <PokemonData>{}
    let url = this.apiUrl + 'pokemon/' + name;
    pokemonData = await lastValueFrom(this.http.get<PokemonData>(url).pipe(catchError(() => [defaultPokemonData]), timeout(this.dataTimeout)));
    return pokemonData;
  }

  async getItemByName(name: string) : Promise<Item>
  {
    let item: Item = <Item>{}
    let url = this.apiUrl + 'item/name/' + name;
    item = await lastValueFrom(this.http.get<Item>(url).pipe(catchError(() => [DefaultItem]), timeout(this.dataTimeout)));
    return item;
  }

  async getAbilityByName(name: string) : Promise<Ability>
  {
    let ability: Ability = <Ability>{}
    let url = this.apiUrl + 'ability/name/' + name;
    ability = await lastValueFrom(this.http.get<Ability>(url).pipe(catchError(() => [defaultAbility]), timeout(this.dataTimeout)));
    return ability; 
  }

  async getNatureByName(name: string) : Promise<Nature>
  {
    let nature: Nature = <Nature>{}
    let url = this.apiUrl + 'nature/name/' + name;
    nature = await lastValueFrom(this.http.get<Nature>(url).pipe(catchError(() => [defaultNature]), timeout(this.dataTimeout)));
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
    move = await lastValueFrom(this.http.get<Move>(url).pipe(catchError(() => [defaultMove]), timeout(this.dataTimeout)));
    return move;
  }

  async getType(typeName: string, teratype?: boolean) : Promise<TypeWithEffectiveness>
  {
    let type: TypeWithEffectiveness = <TypeWithEffectiveness>{};
    let url = this.apiUrl + 'type/' + (teratype ? 'teratype/' : '') + typeName;
    this.http.get<TypeWithEffectiveness>(url).subscribe
    type = await lastValueFrom(this.http.get<TypeWithEffectiveness>(url).pipe(catchError(() => [defaultTypeWithEffectiveness]), timeout(this.dataTimeout)));
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
      stat.name = 
      {
        content: value,
        language: ""
      };
      stat.value = Number(statData[1]);
      return stat;
    })
  }

  async getStatName(identifier: string) : Promise<string>
  {
    let statName: string = '';
    let url = this.apiUrl + 'stat/' + identifier;
    statName = await lastValueFrom(this.http.get(url, {responseType: 'text'}).pipe(timeout(this.dataTimeout)));
    return statName;
  }

  async queryPokemonsByName(key: string) : Promise<Tag[]>
  {
    let pokemons: Tag[] = [];
    let url = this.apiUrl + 'pokemon/query';
    let params = new HttpParams().set('key', key ?? "");
    pokemons = await lastValueFrom(this.http.get<Tag[]>(url, {params: params}).pipe(timeout(this.dataTimeout)));
    return pokemons; 
  }

  async queryMovesByName(key: string) : Promise<Tag[]>
  {
    let moves: Tag[] = [];
    let url = this.apiUrl + 'move/query';
    let params = new HttpParams().set('key', key ?? "");
    moves = await lastValueFrom(this.http.get<Tag[]>(url, {params: params}).pipe(timeout(this.dataTimeout)));
    return moves; 
  }

  async queryItemsByName(key: string) : Promise<Tag[]>
  {
    let items: Tag[] = [];
    let url = this.apiUrl + 'item/query';
    let params = new HttpParams().set('key', key ?? "");
    items = await lastValueFrom(this.http.get<Tag[]>(url, {params: params}).pipe(timeout(this.dataTimeout)));
    return items; 
  }

  async queryAbilitiesByName(key: string) : Promise<Tag[]>
  {
    let abilities: Tag[] = [];
    let url = this.apiUrl + 'ability/query';
    let params = new HttpParams().set('key', key ?? "");
    abilities = await lastValueFrom(this.http.get<Tag[]>(url, {params: params}).pipe(timeout(this.dataTimeout)));
    return abilities; 
  }
  async getAllAbilities() : Promise<Tag[]>
  {
    let abilities: Tag[] = [];
    let url = this.apiUrl + 'ability/all';
    abilities = await lastValueFrom(this.http.get<Tag[]>(url).pipe(timeout(this.dataTimeout)));
    return abilities; 
  }
  async getPokemonAbilities(id: number) : Promise<Tag[]>
  {
    let types: Tag[] = [];
    let url = this.apiUrl + 'ability/pokemon/' + id;
    types = await lastValueFrom(this.http.get<Tag[]>(url).pipe(timeout(this.dataTimeout)));
    return types; 
  }

  async queryNaturesByName(key: string) : Promise<Tag[]>
  {
    let natures: Tag[] = [];
    let url = this.apiUrl + 'nature/query';
    let params = new HttpParams().set('key', key ?? "");
    natures = await lastValueFrom(this.http.get<Tag[]>(url, {params: params}).pipe(timeout(this.dataTimeout)));
    return natures; 
  }
  async getAllNatures() : Promise<Nature[]>
  {
    let regulations: Nature[] = [];
    let url = this.apiUrl + 'nature/all';
    regulations = await lastValueFrom(this.http.get<Nature[]>(url).pipe(timeout(this.dataTimeout)));
    return regulations; 
  }

  async queryTeraTypesByName(key: string) : Promise<Tag[]>
  {
    let teraTypes: Tag[] = [];
    let url = this.apiUrl + 'type/teratype/query';
    let params = new HttpParams().set('key', key ?? "");
    teraTypes = await lastValueFrom(this.http.get<Tag[]>(url, {params: params}).pipe(timeout(this.dataTimeout)));
    return teraTypes; 
  }
  async getAllTeraTypes() : Promise<Type[]>
  {
    let types: Type[] = [];
    let url = this.apiUrl + 'type/teratype/all';
    types = await lastValueFrom(this.http.get<Type[]>(url).pipe(timeout(this.dataTimeout)));
    return types; 
  }

  createEmptyPokemon(): Pokemon
  {
    let pokemon: Pokemon = 
    {
      name: undefined,
      nickname: undefined,
      dexNumber: undefined,
      preEvolution: undefined,
      evolutions: [],
      types: undefined,
      teraType: undefined,
      item: undefined,
      ability: undefined,
      nature: undefined,
      moves: [undefined, undefined, undefined, undefined],
      stats: [],
      ivs:     
      [
        {
          name: 
          {
            content: "HP",
            language: "en"
          },
          identifier: "hp",
          value: 0
        },
        {
          name: 
          {
            content: "Atk",
            language: "en"
          },
          identifier: "atk",
          value: 0
        },
        {
          name: 
          {
            content: "Def",
            language: "en"
          },
          identifier: "def",
          value: 0
        },
        {
          name: 
          {
            content: "SpA",
            language: "en"
          },
          identifier: "spa",
          value: 0
        },
        {
          name: 
          {
            content: "SpD",
            language: "en"
          },
          identifier: "spd",
          value: 0
        },
        {
          name: 
          {
            content: "Spe",
            language: "en"
          },
          identifier: "spe",
          value: 0
        }
      ],
      evs: 
      [
        {
          name: 
          {
            content: "HP",
            language: "en"
          },
          identifier: "hp",
          value: 0
        },
        {
          name: 
          {
            content: "Atk",
            language: "en"
          },
          identifier: "atk",
          value: 0
        },
        {
          name: 
          {
            content: "Def",
            language: "en"
          },
          identifier: "def",
          value: 0
        },
        {
          name: 
          {
            content: "SpA",
            language: "en"
          },
          identifier: "spa",
          value: 0
        },
        {
          name: 
          {
            content: "SpD",
            language: "en"
          },
          identifier: "spd",
          value: 0
        },
        {
          name: 
          {
            content: "Spe",
            language: "en"
          },
          identifier: "spe",
          value: 0
        }
      ],
      level: 50,
      shiny: undefined,
      gender: false,
      sprite: undefined,
    }
    return pokemon;
  }
} 
