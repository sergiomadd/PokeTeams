import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, lastValueFrom, timeout } from "rxjs";
import { environment } from "src/environments/environment";
import { Ability, defaultAbility } from "../models/pokemon/ability.model";
import { Item, defaultItem } from "../models/pokemon/item.model";
import { Move, defaultMove } from "../models/pokemon/move.model";
import { Nature, defaultNature } from "../models/pokemon/nature.model";
import { Pokemon } from "../models/pokemon/pokemon.model";
import { PokemonData, defaultPokemonData } from "../models/pokemon/pokemonData.dto";
import { PokemonPreview } from "../models/pokemon/pokemonPreview.model";
import { Stat } from "../models/pokemon/stat.model";
import { TypeWithEffectiveness, defaultTypeWithEffectiveness } from "../models/pokemon/typewitheffectiveness.model";
import { PokePaste } from "../models/team/pokePaste.model";

@Injectable({
  providedIn: 'root'
})
export class PokemonService 
{
  private apiUrl = environment.apiUrl;
  private dataTimeout = 5000;

  constructor(private http: HttpClient) 
  {

  }

  async buildPokemon(pokePaste: PokePaste) : Promise<Pokemon>
  {
    let pokemon: Pokemon = <Pokemon>{};

    try 
    {
      const pokemonDataPromise: Promise<PokemonData> | undefined = pokePaste.name ? this.getPokemonDataByName(pokePaste.name) : undefined;
      const teraTypePromise: Promise<TypeWithEffectiveness> | undefined = pokePaste.teratype ? this.getType(pokePaste.teratype, true) : undefined;
      const itemPromise: Promise<Item> | undefined = pokePaste.item ? this.getItemByName(pokePaste.item) : undefined;
      const abilityPromise: Promise<Ability> | undefined = pokePaste.ability ? this.getAbilityByName(pokePaste.ability) : undefined;
      const naturePromise: Promise<Nature> | undefined = pokePaste.nature ? this.getNatureByName(pokePaste.nature) : undefined;
      const movesPromise: Promise<Move[]> | undefined = pokePaste.moves ? this.getMoves(pokePaste.moves) : undefined;
      
      await Promise.allSettled([pokemonDataPromise, teraTypePromise, itemPromise, abilityPromise, naturePromise, movesPromise])
      .then(([pokemonData, teraType, itemPromise, abilityPromise, naturePromise, movesPromise]) => 
      {
        pokemon.name = pokemonData.status == "fulfilled" ? pokemonData.value?.name : undefined;
        pokemon.dexNumber = pokemonData.status == "fulfilled" ? pokemonData.value?.dexNumber : 0;
        pokemon.pokemonId = pokemonData.status == "fulfilled" ? pokemonData.value?.pokemonId : 0;
        pokemon.preEvolution = pokemonData.status == "fulfilled" ? pokemonData.value?.preEvolution : undefined;
        pokemon.evolutions = pokemonData.status == "fulfilled" ? pokemonData.value?.evolutions ?? [] : [];
        pokemon.formId = pokemonData.status == "fulfilled" ? pokemonData.value?.formId : undefined;
        pokemon.forms = pokemonData.status == "fulfilled" ? pokemonData.value?.forms ?? [] : [];
        pokemon.types = pokemonData.status == "fulfilled" ? pokemonData.value?.types : undefined;
        pokemon.stats = pokemonData.status == "fulfilled" ? pokemonData.value?.stats ?? [] : [];
        pokemon.sprite = pokemonData.status == "fulfilled" ? pokemonData.value?.sprite : undefined;
        pokemon.nickname = pokePaste.nickname;
        pokemon.level = pokePaste.level ? pokePaste.level : 50;
        pokemon.shiny = pokePaste.shiny ? pokePaste.shiny : undefined;
        pokemon.gender = pokePaste.gender ? pokePaste.gender : pokemonData.status == "fulfilled" ? pokemonData.value?.gender : undefined;
        pokemon.teraType = teraType.status == "fulfilled" ? teraType.value : undefined;
        pokemon.item = itemPromise.status == "fulfilled" ? itemPromise.value : undefined; 
        pokemon.ability = abilityPromise.status == "fulfilled" ? abilityPromise.value : undefined; 
        pokemon.nature = naturePromise.status == "fulfilled" ? naturePromise.value : undefined; 
        pokemon.moves = movesPromise.status == "fulfilled" ? movesPromise.value ?? [] : []; 
      });
    } 
    catch (error) 
    {
      console.log("Error getting pokemons.", error);
    }
    
    if(pokemon.dexNumber && pokemon.ability)
    {
      pokemon.ability.hidden = await this.isAbilityHidden(pokemon.ability?.identifier, pokemon.dexNumber);
    }

    pokemon.ivs = pokePaste.ivs ? this.getStats(pokePaste.ivs) : [];
    pokemon.evs = pokePaste.evs ? this.getStats(pokePaste.evs) : [];
    return pokemon;
  }

  getPokemonById(id: number) : Observable<Pokemon>
  {
    let url = this.apiUrl + 'pokemon/' + id;
    return this.http.get<Pokemon>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  getPokemonByIdNoLang(id: number) : Observable<Pokemon>
  {
    let url = this.apiUrl + 'pokemon/nolang/' + id;
    return this.http.get<Pokemon>(url, {withCredentials: true}).pipe(timeout(this.dataTimeout));
  }

  async getPokemonPreviewById(id: number) : Promise<PokemonPreview>
  {
    let pokemonPreview: PokemonPreview = <PokemonPreview>{}
    let url = this.apiUrl + 'pokemon/preview/' + id;
    pokemonPreview = await lastValueFrom(this.http.get<PokemonPreview>(url).pipe(timeout(this.dataTimeout * 2)));
    return pokemonPreview;
  }
  
  getTeamPokemonPreviews(teamID: string) : Observable<PokemonPreview[]>
  {
    let url = this.apiUrl + 'pokemon/pokemon-previews/' + teamID;
    return this.http.get<PokemonPreview[]>(url).pipe(timeout(this.dataTimeout * 2));
  }

  async getPokemonDataByName(name: string) : Promise<PokemonData>
  {
    let pokemonData: PokemonData = <PokemonData>{}
    let url = this.apiUrl + 'pokemon/name/' + name;
    pokemonData = await lastValueFrom(this.http.get<PokemonData>(url).pipe(catchError(() => [defaultPokemonData]), timeout(this.dataTimeout)));
    return pokemonData;
  }

  async getPokemonDataByDexNumber(dexNumber: string) : Promise<PokemonData>
  {
    let pokemonData: PokemonData = <PokemonData>{}
    let url = this.apiUrl + 'pokemon/dex/' + dexNumber;
    pokemonData = await lastValueFrom(this.http.get<PokemonData>(url).pipe(catchError(() => [defaultPokemonData]), timeout(this.dataTimeout)));
    return pokemonData;
  }

  async getItemByName(name: string) : Promise<Item>
  {
    let item: Item = <Item>{}
    let url = this.apiUrl + 'item/name/' + name;
    item = await lastValueFrom(this.http.get<Item>(url).pipe(catchError(() => [defaultItem]), timeout(this.dataTimeout)));
    return item;
  }

  async getAbilityByName(name: string) : Promise<Ability>
  {
    let ability: Ability = <Ability>{}
    let url = this.apiUrl + 'ability/name/' + name;
    ability = await lastValueFrom(this.http.get<Ability>(url).pipe(catchError(() => [defaultAbility]), timeout(this.dataTimeout)));
    return ability; 
  }

  async isAbilityHidden(abilityIdentifier: string, dexNumber: number) : Promise<boolean>
  {
    let url = this.apiUrl + 'ability/hidden';
    const params = new HttpParams()
      .set('abilityIdentifier', abilityIdentifier)
      .set('dexNumber', dexNumber);
    return await lastValueFrom(this.http.get<boolean>(url, {params}).pipe(catchError(() => [false]), timeout(this.dataTimeout)));; 
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
    type = await lastValueFrom(this.http.get<TypeWithEffectiveness>(url).pipe(catchError(() => [defaultTypeWithEffectiveness]), timeout(this.dataTimeout)));
    return type;
  }

  getStats(statsData: string[][]) : Stat[]
  {
    const stats: Stat[] = [];
    for (const statData of statsData)
    {
      stats.push(this.createStat(statData));
    }
    return stats;
  }

  createStat(statData: string[]) : Stat
  {
    let stat: Stat = <Stat>{};
    stat.identifier = statData[0];
    stat.name = undefined;
    stat.value = Number(statData[1]);
    return stat;
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
          identifier: "hp",
          value: 0
        },
        {
          identifier: "attack",
          value: 0
        },
        {
          identifier: "defense",
          value: 0
        },
        {
          identifier: "special-attack",
          value: 0
        },
        {
          identifier: "special-defense",
          value: 0
        },
        {
          identifier: "speed",
          value: 0
        }
      ],
      evs: 
      [
        {
          identifier: "hp",
          value: 0
        },
        {
          identifier: "attack",
          value: 0
        },
        {
          identifier: "defense",
          value: 0
        },
        {
          identifier: "special-attack",
          value: 0
        },
        {
          identifier: "special-defense",
          value: 0
        },
        {
          identifier: "speed",
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
