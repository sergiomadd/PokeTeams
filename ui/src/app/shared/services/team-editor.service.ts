import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { I18nService } from 'src/app/core/helpers/i18n.service';
import { Pokemon } from 'src/app/core/models/pokemon/pokemon.model';
import { Team } from 'src/app/core/models/team/team.model';
import { TeamOptions } from 'src/app/core/models/team/teamOptions.model';
import { PokemonService } from '../../core/services/pokemon.service';

@Injectable({
  providedIn: 'root'
})
export class TeamEditorService 
{
  pokemonService = inject(PokemonService);
  i18n = inject(I18nService);

  private team$: BehaviorSubject<Team> = new BehaviorSubject<Team>(<Team>{});
  selectedTeam$ = this.team$.asObservable();

  private _exampleTeamModified$: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(undefined);
  exampleTeamModified$ = this._exampleTeamModified$.asObservable();


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
      this.setExampleTeamModified(true);
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
  }

  updatePokemon(pokemon: Pokemon | undefined, index: number, firstLoad?: boolean)
  {
    const pokemonsToUpdate: (Pokemon | null | undefined)[] = this.team$.getValue().pokemons;
    pokemonsToUpdate[index] = pokemon;
    this.updatePokemons(pokemonsToUpdate);
    if(!firstLoad) { this.setExampleTeamModified(true); }
  }

  validateTeam(team: Team): string | undefined
  {
    if(team.pokemons.length <= 0)
    {
      return this.i18n.translateKey('team.editor.errors.no_pokemons');
    }
    if(team.pokemons.length > 6)
    {
      return this.i18n.translateKeyWithParameters('team.editor.errors.too_many_pokemons', { max: 6 });
    }
    if(team.pokemons.some(p => p && !p.dexNumber || (p?.dexNumber && p.dexNumber < 1)))
    {
      return this.i18n.translateKey('team.editor.errors.empty_pokemons');
    }
    if(team.player?.username && team.player?.username.length > 32)
    {
      return this.i18n.translateKeyWithParameters('team.editor.errors.player', { maxlength: 32 });
    }
    if(team.rentalCode && team.rentalCode.length > 32)
    {
      return this.i18n.translateKeyWithParameters('team.editor.errors.rental_Code', { maxlength: 32 });
    }
    if(team.title && team.title.length > 128)
    {
      return this.i18n.translateKeyWithParameters('team.editor.errors.title', { maxlength: 128 });
    }
    //Put errored moves as undefined
    if(team.pokemons.some(p => p?.moves.some(m => m?.identifier == "error")))
    {
      team.pokemons.forEach(pokemon => 
      {
        if(pokemon && pokemon.moves)
        {
          pokemon.moves = pokemon.moves.map(move => move?.identifier === "error" ? undefined : move)
        }
      });
    }
    return undefined;
  }

  setEmptyTeam()
  {
    this.team$.next(
    {
      id: '',
      pokemons: [],
      options: this.getEmptyOptions(),
      player: undefined,
      user: undefined,
      title: undefined,
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
    const options: TeamOptions =     
    {
      ivsVisibility: true,
      evsVisibility: true,
      naturesVisibility: true,
      showIVs: true,
      showEVs: true,
      showNature: true,
      showNickname: true,
      maxStat: 0
    }
    
    return options;
  }

  setExampleTeamModified(value?: boolean)
  {
    this._exampleTeamModified$.next(value);
  }
}
