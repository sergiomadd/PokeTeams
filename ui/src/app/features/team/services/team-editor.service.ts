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
    this.addPokemon(this.pokemonService.createEmptyPokemon());
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
