import { Component, EventEmitter, inject, Input, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ParserService } from 'src/app/core/helpers/parser.service';
import { ThemeService } from 'src/app/core/helpers/theme.service';
import { UtilService } from 'src/app/core/helpers/util.service';
import { WindowService } from 'src/app/core/helpers/window.service';
import { Move } from 'src/app/core/models/pokemon/move.model';
import { Team } from 'src/app/core/models/team/team.model';
import { TeamCompareService } from 'src/app/shared/services/team-compare.service';
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
  compareService = inject(TeamCompareService);

  @Input() team?: Team;
  @Input() which?: string;
  @Output() selectedIndexesEvent = new EventEmitter<number[]>()

  @ViewChildren(PokemonCardComponent) pokemonComponents!:QueryList<PokemonCardComponent>;

  showAllStats: boolean = false;
  showAllNotes: boolean = false;
  hasAnyNotes: boolean = false;
  maxStat: number = 0;
  tooltips: boolean[] = [false, false, false]

  pokemonIndex1: number = -1;
  pokemonIndex2: number = -1;
  order: number = 1;
  moveA: Move | undefined;
  moveB: Move | undefined;

  ngOnInit()
  {
    this.compareService.selectedMoveA$.subscribe(value => 
    {
      this.moveA = value;
    })
    this.compareService.selectedMoveB$.subscribe(value => 
    {
      this.moveB = value;
    })
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes["team"])
    {
      this.selectPokemon(0, true, 1);
      this.selectPokemon(1, true, 2);
    }
  }

  selectPokemon(index, force: boolean = false, indexToForce: number = -1)
  {
    if(force)
    {
      if(indexToForce === 1)
      {
        this.pokemonIndex1 = index;
      }
      if(indexToForce === 2)
      {
        this.pokemonIndex2 = index;
      }
      this.selectedIndexesEvent.emit([this.pokemonIndex1, this.pokemonIndex2])
      return;
    }
    if(index === this.pokemonIndex1)
    {
      this.pokemonIndex1 = -1;
    }
    else if(index === this.pokemonIndex2)
    {
      this.pokemonIndex2 = -1;
    }
    else if(!this.pokemonIndex1 || this.order === 1)
    {
      this.pokemonIndex1 = index;
      this.order = 2;
    }
    else if(!this.pokemonIndex2 || this.order === 2)
    {
      this.pokemonIndex2 = index;
      this.order = 1;
    }
    if(this.pokemonIndex1 && this.pokemonIndex2)
    {
      this.closeAllTooltips();
    }

    this.selectedIndexesEvent.emit([this.pokemonIndex1, this.pokemonIndex2])
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
