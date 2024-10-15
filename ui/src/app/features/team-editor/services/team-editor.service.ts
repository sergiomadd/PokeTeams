import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pokemon } from '../../pokemon/models/pokemon.model';
import { Team } from '../../team/models/team.model';
import { TeamOptions } from '../../team/models/teamOptions.model';

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

  addPokemon(pokemon: Pokemon)
  {
    this.team$.next(
      {
        ...this.team$.getValue(),
        pokemons: [...this.team$.getValue().pokemons, pokemon]
      }
    );
  }

  updatePokemon(updated: Pokemon)
  {
    /*
    console.log("Updating pokemon")
    console.log(this.team$.getValue().pokemons[0].nickname)
    
    const updatedPokemons: Pokemon[] = this.team$.getValue().pokemons;
    const index: number = this.team$.getValue().pokemons.indexOf(updated);
    updatedPokemons[index] = updated;
    this.team$.next(this.team$.getValue());
    
    //new

    this.team$.next({...this.team$.value, pokemons: this.team$.value.pokemons
      .map(pokemon => 
      {
        return pokemon.dexNumber === updated.dexNumber ? updated : pokemon
      })})
      */
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
}
