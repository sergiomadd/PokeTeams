import { Component, inject, SimpleChanges, input, output, viewChildren, signal, effect } from '@angular/core';
import { ParserService } from '../../../../core/helpers/parser.service';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { Move } from '../../../../core/models/pokemon/move.model';
import { Team } from '../../../../core/models/team/team.model';
import { TeamCompareService } from '../../../services/team-compare.service';
import { PokemonCardComponent } from '../../pokemon/pokemon-card/pokemon-card.component';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { TooltipComponent } from '../../dumb/tooltip/tooltip.component';
import { TranslatePipe } from '@ngx-translate/core';
import { CalcMoveEffectivenessPipe } from '../../../pipes/pokemon-pipes/calcMoveEffectiveness.pipe';
import { GetDefenseEffectivenessPipe } from '../../../pipes/pokemon-pipes/getDefenseEffectivenes.pipe';
import { GetPokemonSpritePathPipe } from '../../../pipes/pokemon-pipes/getPokemonSpritePath.pipe';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-team-battle',
    templateUrl: './team-battle.component.html',
    styleUrl: './team-battle.component.scss',
    imports: [NgClass, NgStyle, NgTemplateOutlet, PokemonCardComponent, TooltipComponent, TranslatePipe, CalcMoveEffectivenessPipe, GetDefenseEffectivenessPipe, GetPokemonSpritePathPipe]
})
export class TeamBattleComponent 
{
  parser = inject(ParserService);
  util = inject(UtilService);
  window = inject(WindowService);
  theme = inject(ThemeService);
  compareService = inject(TeamCompareService);

  readonly team = input<Team>();
  readonly which = input<string>();
  readonly selectedIndexesEvent = output<number[]>();

  readonly pokemonComponents = viewChildren(PokemonCardComponent);

  showAllStats = signal<boolean>(false);
  showAllNotes = signal<boolean>(false);
  hasAnyNotes = signal<boolean>(false);
  maxStat = signal<number>(0);
  tooltips = signal<boolean[]>([false, false, false]);

  pokemonIndex1 = signal<number>(-1);
  pokemonIndex2 = signal<number>(-1);
  order = signal<number>(1);
  selectedMoveA = toSignal(this.compareService.selectedMoveA$);
  selectedMoveB = toSignal(this.compareService.selectedMoveB$);
  teraTypeEnabled = signal<boolean[]>([]);

  constructor()
  {
    effect(() => 
    {
      const which = this.which();
      if(which === 'A')
      {
        this.compareService.teratypeEnabledIndexesAObservable$.subscribe(value => 
        {
          this.teraTypeEnabled.set([...value]);
        })
      }
      else if(which === 'B')
      {
        this.compareService.teratypeEnabledIndexesBObservable$.subscribe(value => 
        {
          this.teraTypeEnabled.set([...value]);
        })
      }
    })

    effect(() =>
    {
      this.team();
      this.selectPokemon(0, true, 1);
      this.selectPokemon(1, true, 2);
    })
  }

  selectPokemon(index, force: boolean = false, indexToForce: number = -1)
  {
    if(force)
    {
      if(indexToForce === 1)
      {
        this.pokemonIndex1.set(index);
      }
      if(indexToForce === 2)
      {
        this.pokemonIndex2.set(index);
      }
      this.selectedIndexesEvent.emit([this.pokemonIndex1(), this.pokemonIndex2()])
      return;
    }
    if(index === this.pokemonIndex1())
    {
      this.pokemonIndex1.set(-1);
    }
    else if(index === this.pokemonIndex2())
    {
      this.pokemonIndex2.set(-1);
    }
    else if(!this.pokemonIndex1() || this.order() === 1)
    {
      this.pokemonIndex1.set(index);
      this.order.set(2);
    }
    else if(!this.pokemonIndex2() || this.order() === 2)
    {
      this.pokemonIndex2.set(index);
      this.order.set(1);
    }
    if(this.pokemonIndex1() && this.pokemonIndex2())
    {
      this.closeAllTooltips();
    }

    this.selectedIndexesEvent.emit([this.pokemonIndex1(), this.pokemonIndex2()])
  }

  clickOptions(index: number)
  {
    switch(index)
    {
      case 0:
        this.showAllStats.update(value => !value)
        this.pokemonComponents().forEach(pokemon => 
        {
          pokemon.showStats[0] = this.showAllStats();
        });
      break;
      case 1:
        this.showAllNotes.update(value => !value)
        this.pokemonComponents().forEach(pokemon => 
        {
          if(pokemon.pokemon()?.notes)
          {
            pokemon.showNotes[0] = this.showAllNotes();
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
    const pokemonComponents = this.pokemonComponents();
    if(pokemonComponents)
    {
      pokemonComponents.forEach(pokemonComponent => 
        {
          pokemonComponent.closeAllTooltips();
        }
      );
    }
  }
}
