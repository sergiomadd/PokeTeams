import { Component, EventEmitter, inject, Input, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ParserService } from 'src/app/core/helpers/parser.service';
import { ThemeService } from 'src/app/core/helpers/theme.service';
import { UtilService } from 'src/app/core/helpers/util.service';
import { WindowService } from 'src/app/core/helpers/window.service';
import { Pokemon } from 'src/app/core/models/pokemon/pokemon.model';
import { Team } from 'src/app/core/models/team/team.model';
import { PokemonCardComponent } from '../../pokemon/pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-team-battle',
  templateUrl: './team-battle.component.html',
  styleUrl: './team-battle.component.scss'
})
export class TeamBattleComponent 
{
  parser = inject(ParserService);
  util = inject(UtilService);
  window = inject(WindowService);
  theme = inject(ThemeService);

  @Input() team?: Team;
  @Output() selectedIndexesEvent = new EventEmitter<number[]>()

  @ViewChildren(PokemonCardComponent) pokemonComponents!:QueryList<PokemonCardComponent>;

  showAllStats: boolean = false;
  showAllNotes: boolean = false;
  hasAnyNotes: boolean = false;
  maxStat: number = 0;
  tooltips: boolean[] = [false, false, false]

  pokemon1?: Pokemon;
  selectedPokemonIndex1: number = -1;
  pokemon2?: Pokemon;
  selectedPokemonIndex2: number = -1;
  order: number = 1;

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes["team"])
    {
      this.selectPokemon(0);
      this.selectPokemon(1);
    }
  }

  selectPokemon(index)
  {
    if(index === this.selectedPokemonIndex1)
    {
      this.selectedPokemonIndex1 = -1;
      this.pokemon1 = undefined;
    }
    else if(index === this.selectedPokemonIndex2)
    {
      this.selectedPokemonIndex2 = -1;
      this.pokemon2 = undefined;
    }
    else if(!this.pokemon1 || this.order === 1)
    {
      this.selectedPokemonIndex1 = index;
      this.pokemon1 = this.team?.pokemons[this.selectedPokemonIndex1] ?? undefined;
      this.order = 2;
    }
    else if(!this.pokemon2 || this.order === 2)
    {
      this.selectedPokemonIndex2 = index;
      this.pokemon2 = this.team?.pokemons[this.selectedPokemonIndex2] ?? undefined;
      this.order = 1;
    }
    if(this.pokemon1 && this.pokemon2)
    {
      this.closeAllTooltips();
    }
    this.selectedIndexesEvent.emit([this.selectedPokemonIndex1, this.selectedPokemonIndex2])
  }

  clickOptions(index: number)
  {
    switch(index)
    {
      case 0:
        this.showAllStats = !this.showAllStats;
        this.pokemonComponents.forEach(pokemon => 
        {
          pokemon.showStats[0] = this.showAllStats;
        });
      break;
      case 1:
        this.showAllNotes = !this.showAllNotes;
        this.pokemonComponents.forEach(pokemon => 
        {
          if(pokemon.pokemon?.notes)
          {
            pokemon.showNotes[0] = this.showAllNotes;
          }
        });
        break;
      case 2:
        this.closeAllTooltips();
        break; 
    }
  }

  closeAllTooltips()
  {
    if(this.pokemonComponents)
    {
      this.pokemonComponents.forEach(pokemonComponent => 
        {
          pokemonComponent.closeAllTooltips();
        }
      );
    }
  }
}
