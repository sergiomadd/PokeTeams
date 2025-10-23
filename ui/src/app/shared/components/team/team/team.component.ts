import { Component, EventEmitter, inject, input, model, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ParserService } from '../../../../core/helpers/parser.service';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { Tag } from '../../../../core/models/team/tag.model';
import { Team } from '../../../../core/models/team/team.model';
import { TeamOptions } from '../../../../core/models/team/teamOptions.model';
import { PokemonCardComponent } from '../../pokemon/pokemon-card/pokemon-card.component';

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.scss'],
    standalone: false
})
export class TeamComponent 
{
  parser = inject(ParserService);
  util = inject(UtilService);
  window = inject(WindowService);
  theme = inject(ThemeService);

  readonly team = model<Team>();
  readonly removableTags = input<boolean | undefined>(false);

  @ViewChildren(PokemonCardComponent) pokemonComponents!:QueryList<PokemonCardComponent>;

  showAllStats: boolean = false;
  showAllNotes: boolean = false;
  hasAnyNotes: boolean = false;
  maxStat: number = 0;
  rentalCodeCopied: boolean = false;
  tooltips: boolean[] = [false, false, false]
  isPlayerSameAsUser: boolean = false;

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['team'])
    {
      this.team.set(changes['team'].currentValue);
      this.updateOptions();
      this.checkUserToPlayer()
    }
  }

  checkUserToPlayer()
  {
    const team = this.team();
    if(team && team.player?.username && team.user
        && (team.player.username === team.user.username 
          || team.player.username === team.user.name))
    {
      this.isPlayerSameAsUser = true;
      if(team.user.picture)
      {
        team.player.picture = team.user.picture;
      }
      return;
    }
    this.isPlayerSameAsUser = false;
    if(team?.player) { team.player.picture = undefined; }
  }  

  updateOptions()
  {
    const team = this.team();
    if(team)
    {
      team.options.showIVs = team?.options.ivsVisibility;
      //If ivs not null && no ivs in any pokemon -> dont show ivs button
      if(team.options.showIVs && !this.anyIVs())
      {
        team.options.showIVs = undefined;
      }

      team.options.showEVs = team?.options.evsVisibility;
      if(team.options.showEVs && !this.anyEVs())
      {
        team.options.showEVs = undefined;
      }

      team.options.showNature = team?.options.naturesVisibility;
      if(team.options.showNature && !this.anyNatures())
      {
        team.options.showNature = undefined;
      }

      this.hasAnyNotes = this.anyNotes();
    }
  }

  anyIVs() : boolean
  {
    const team = this.team();
    if(team?.pokemons)
    {
      return team?.pokemons.some(p => p?.ivs && p?.ivs.some(i => i.value != 0));
    }
    return false;
  }

  anyEVs() : boolean
  {
    const team = this.team();
    if(team?.pokemons)
    {
      return team?.pokemons.some(p => p?.evs && p?.evs.some(i => i.value != 0));
    }
    return false;
  }

  anyNatures() : boolean
  {
    const team = this.team();
    if(team?.pokemons)
    {
      return team?.pokemons.some(p => p?.nature);
    }
    return false;
  }

  anyNotes()
  {
    const team = this.team();
    if(team?.pokemons)
    {
      return team?.pokemons.some(p => p?.notes);
    }
    return false;
  }
  
  forceChange(options: TeamOptions)
  {
    this.team()!.options = structuredClone(options);
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
          if(pokemon.pokemon()?.notes)
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
    this.pokemonComponents.forEach(pokemonComponent => 
      {
        pokemonComponent.closeAllTooltips();
      }
    );
  }

  closeAllProfileTooltips()
  {
    this.pokemonComponents.forEach(pokemonComponent => 
      {
        pokemonComponent.closeAllProfileTooltips();
      }
    );
  }

  @Output() removeEvent = new EventEmitter<Tag>()

  removeTag(index)
  {
    if(this.removableTags())
    {
      this.team()?.tags?.splice(index, 1);
      this.removeEvent.emit();
    }
  }

  statsUpdated(newMax)
  {
    if(newMax > this.maxStat) 
    {
      this.maxStat = newMax;
      const team = this.team();
      if(team && team.options) 
      {
        team.options = {...team.options, maxStat: this.maxStat}
      }
    }
  }

  copyRentalCode()
  {
    const team = this.team();
    if(team?.rentalCode)
    {
      this.rentalCodeCopied = true;
      this.util.copyToClipboard(team?.rentalCode);
      setTimeout(()=>
      {
        this.rentalCodeCopied = false;
      }, 1000);
    }
  }

  toggleIVs()
  {
    const team = this.team();
    if(team?.options)
    {
      team.options.showIVs = !team.options.showIVs
    }
  }

  toggleEVs()
  {
    const team = this.team();
    if(team?.options)
    {
      team.options.showEVs = !team.options.showEVs
    }
  }

  toggleNatures()
  {
    const team = this.team();
    if(team?.options)
    {
      team.options.showNature = !team.options.showNature
    }
  }

  clickSection(index: number)
  {    
    if(this.tooltips[index])
    {
      this.tooltips[index] = false;
    }
    else
    {
      for(var i = 0; i < this.tooltips.length; i++) 
      {
        this.tooltips[i] = false;
      }
      this.tooltips[index] = true;
    }
  }
}