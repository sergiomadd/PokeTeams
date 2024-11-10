import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pokemon } from '../../pokemon/models/pokemon.model';
import { Team } from '../models/team.model';
import { TeamOptions } from '../models/teamOptions.model';

@Injectable({
  providedIn: 'root'
})
export class TeamEditorService 
{
  private team$: BehaviorSubject<Team> = new BehaviorSubject<Team>(<Team>{});
  selectedTeam$ = this.team$.asObservable();

  constructor() 
  {
    this.setEmptyTeam();
  }

  setTeam(newTeam: Team)
  {
    this.team$.next(newTeam);
  }

  //Find using dex number

  addPokemon(pokemon: Pokemon)
  {
    this.team$.next(
      {
        ...this.team$.getValue(),
        pokemons: [...this.team$.getValue().pokemons, pokemon]
      }
    );
  }

  addEmptyPokemon()
  {
    this.addPokemon(this.createEmptyPokemon());
  }

  deletePokemon(index: number): boolean
  {
    if(this.team$.getValue().pokemons[index])
    {
      this.team$.getValue().pokemons.splice(index, 1)
      this.updatePokemons(this.team$.getValue().pokemons);
      return true;
    }
    else { return false }
  }

  updatePokemons(updatedPokemons: Pokemon[])
  {
    this.team$.next(
      {
        ...this.team$.getValue(),
        pokemons: [...updatedPokemons]
      }
    );
  }

  updatePokemon(pokemon: Pokemon, index: number)
  {
    if(this.team$.getValue().pokemons[index])
    {
      const pokemonsToUpdate: Pokemon[] = this.team$.getValue().pokemons;
      pokemonsToUpdate[index] = pokemon;
      this.updatePokemons(pokemonsToUpdate);
      return true;
    }
    else { return false }
  }

  setEmptyTeam()
  {
    this.team$.next(
    {
      id: '',
      pokemons: [],
      options: this.getEmptyOptions(),
      player: undefined,
      tournament: undefined,
      regulation: undefined,
      viewCount: 0,
      visibility: true,
      tags: []
    });
  }

  getEmptyOptions(): TeamOptions
  {
        /*
    this.teamOptions = 
    {
      showIVs: false,
      showEVs: false,
      showNature: false,
      showDexNumber: false,
      showNickname: false,
      showShinyIcon: true,
      showGenderIcon: true,
      maxLevel: 0
    }
    */
    const options: TeamOptions =     
    {
      showIVs: true,
      showEVs: true,
      showNature: true,
      showDexNumber: true,
      showNickname: true,
      showShinyIcon: true,
      showGenderIcon: true,
      maxStat: 0
    }
    
    return options;

  }

  createEmptyPokemon(): Pokemon
  {
    let pokemon: Pokemon = 
    {
      name: "",
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
          name: "HP",
          identifier: "hp",
          value: 0
        },
        {
          name: "Atk",
          identifier: "attack",
          value: 0
        },
        {
          name: "Def",
          identifier: "defense",
          value: 0
        },
        {
          name: "SpA",
          identifier: "special-attack",
          value: 0
        },
        {
          name: "SpD",
          identifier: "special-defense",
          value: 0
        },
        {
          name: "Spe",
          identifier: "speed",
          value: 0
        }
      ],
      evs: 
      [
        {
          name: "HP",
          identifier: "hp",
          value: 0
        },
        {
          name: "Atk",
          identifier: "attack",
          value: 0
        },
        {
          name: "Def",
          identifier: "defense",
          value: 0
        },
        {
          name: "SpA",
          identifier: "special-attack",
          value: 0
        },
        {
          name: "SpD",
          identifier: "special-defense",
          value: 0
        },
        {
          name: "Spe",
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
