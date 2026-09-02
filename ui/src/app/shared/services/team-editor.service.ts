import { inject, Injectable, signal } from '@angular/core';
import { I18nService } from '../../core/helpers/i18n.service';
import { Pokemon } from '../../core/models/pokemon/pokemon.model';
import { Team } from '../../core/models/team/team.model';
import { TeamOptions } from '../../core/models/team/teamOptions.model';
import { PokemonService } from '../../core/services/pokemon.service';

@Injectable({
  providedIn: 'root'
})
export class TeamEditorService 
{
  pokemonService = inject(PokemonService);
  i18n = inject(I18nService);

  team = signal<Team>(<Team>{});
  exampleTeamModified = signal<boolean | undefined>(undefined);

  constructor() 
  {
    this.setEmptyTeam();
  }

  setTeam(newTeam: Team)
  {
    this.team.set(newTeam);
  }

  addPokemon(pokemon: Pokemon | undefined)
  {
    this.team.update(team => team && { ...team, pokemons: [...team.pokemons, pokemon]})
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
    if(this.team().pokemons[index])
    {
      this.team.update(team => team && ({ ...team, pokemons: team.pokemons.filter((p, i) => i !== index) }));
      this.setExampleTeamModified(true);
      return true;
    }
    else { return false }
  }

  updatePokemons(updatedPokemons: (Pokemon | null | undefined)[])
  {
    this.team.update(team => team && { ...team, pokemons: [...updatedPokemons]})
  }

  updatePokemon(pokemon: Pokemon | undefined, index: number, firstLoad?: boolean)
  {
    this.team.update(team => team && { ...team, pokemons: team.pokemons.map((p, i) => i === index ? pokemon : p) })
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
    this.team.set(
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
    this.exampleTeamModified.set(value);
  }
}
