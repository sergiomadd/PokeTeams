import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pokemon } from '../../pokemon/models/pokemon.model';
import { PokemonService } from '../../pokemon/services/pokemon.service';
import { Team } from '../models/team.model';
import { TeamOptions } from '../models/teamOptions.model';

@Injectable({
  providedIn: 'root'
})
export class TeamEditorService 
{
  pokemonService = inject(PokemonService);

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

  addPokemon(pokemon: Pokemon | undefined)
  {
    this.team$.next(
      {
        ...this.team$.getValue(),
        pokemons: [...this.team$.getValue().pokemons, pokemon]
      }
    );
  }

  addPokemonPlaceholders(amount: number)
  {
    for(let i = 0; i < amount; i++)
    {
      this.addUndefinedPokemon();
    }
  }

  addEmptyPokemon()
  {
    this.addPokemon(this.pokemonService.createEmptyPokemon());
  }

  addUndefinedPokemon()
  {
    this.addPokemon(undefined);
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

  updatePokemons(updatedPokemons: (Pokemon | null | undefined)[])
  {
    this.team$.next(
      {
        ...this.team$.getValue(),
        pokemons: [...updatedPokemons]
      }
    );
    //no hay problem con hacer next y spread -> 
    //el problema es que se reemplaza el pokemon entero?
  }

  updatePokemon(pokemon: Pokemon | undefined, index: number)
  {
    const pokemonsToUpdate: (Pokemon | null | undefined)[] = this.team$.getValue().pokemons;
    pokemonsToUpdate[index] = pokemon;
    this.updatePokemons(pokemonsToUpdate);
  }

  validateTeam(team: Team): string | undefined
  {
    if(team.pokemons.length > 0 
      && team.pokemons.length <= 6 
      && team.pokemons.some(p => p && p.dexNumber)) //If dexNumber is undefined -> empty pokemon
    {
      return undefined;
    }
    else if(team.pokemons.length <= 0)
    {
      return "No pokemons loaded";
    }
    else if(team.pokemons.length > 6)
    {
      return "Too many pokemons, max is 6";
    }
    else if(team.pokemons.some(p => p && !p.dexNumber))
    {
      return "There are empty pokemons";
    }
    else
    {
      return "Error uploading team";
    }
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
      date: "",
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
      showNickname: false,
      maxLevel: 0
    }
    */
    const options: TeamOptions =     
    {
      showIVs: true,
      showEVs: true,
      showNature: true,
      showNickname: true,
      maxStat: 0
    }
    
    return options;
  }
}
