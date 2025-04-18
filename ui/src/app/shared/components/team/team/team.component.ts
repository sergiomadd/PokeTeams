import { Component, EventEmitter, inject, Input, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ParserService } from 'src/app/core/helpers/parser.service';
import { ThemeService } from 'src/app/core/helpers/theme.service';
import { UtilService } from 'src/app/core/helpers/util.service';
import { WindowService } from 'src/app/core/helpers/window.service';
import { Tag } from 'src/app/core/models/team/tag.model';
import { Team } from 'src/app/core/models/team/team.model';
import { TeamOptions } from 'src/app/core/models/team/teamOptions.model';
import { PokemonCardComponent } from '../../pokemon/pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent 
{
  parser = inject(ParserService);
  util = inject(UtilService);
  window = inject(WindowService);
  theme = inject(ThemeService);

  @Input() team?: Team;
  @Input() removableTags?: boolean = false;

  @ViewChildren(PokemonCardComponent) pokemonComponents!:QueryList<PokemonCardComponent>;

  showAllStats: boolean = false;
  showAllNotes: boolean = false;
  hasAnyNotes: boolean = false;
  maxStat: number = 0;
  rentalCodeCopied: boolean = false;

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['team'])
    {
      this.team = changes['team'].currentValue;
      this.updateOptions();
    }
  }

  updateOptions()
  {
    if(this.team)
    {
      this.team.options.showIVs = this.team?.options.ivsVisibility;
      //If ivs not null && no ivs in any pokemon -> dont show ivs button
      if(this.team.options.showIVs && !this.anyIVs())
      {
        this.team.options.showIVs = undefined;
      }

      this.team.options.showEVs = this.team?.options.evsVisibility;
      if(this.team.options.showEVs && !this.anyEVs())
      {
        this.team.options.showEVs = undefined;
      }

      this.team.options.showNature = this.team?.options.naturesVisibility;
      if(this.team.options.showNature && !this.anyNatures())
      {
        this.team.options.showNature = undefined;
      }

      this.hasAnyNotes = this.anyNotes();
    }
  }

  anyIVs() : boolean
  {
    if(this.team?.pokemons)
    {
      return this.team?.pokemons.some(p => p?.ivs && p?.ivs.some(i => i.value != 0));
    }
    return false;
  }

  anyEVs() : boolean
  {
    if(this.team?.pokemons)
    {
      return this.team?.pokemons.some(p => p?.evs && p?.evs.some(i => i.value != 0));
    }
    return false;
  }

  anyNatures() : boolean
  {
    if(this.team?.pokemons)
    {
      return this.team?.pokemons.some(p => p?.nature);
    }
    return false;
  }

  anyNotes()
  {
    if(this.team?.pokemons)
    {
      return this.team?.pokemons.some(p => p?.notes);
    }
    return false;
  }
  
  forceChange(options: TeamOptions)
  {
    this.team!.options = structuredClone(options);
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
    this.pokemonComponents.forEach(pokemonComponent => 
      {
        pokemonComponent.closeAllTooltips();
      }
    );
  }

  @Output() removeEvent = new EventEmitter<Tag>()

  removeTag(index)
  {
    if(this.removableTags)
    {
      this.team?.tags?.splice(index, 1);
      this.removeEvent.emit();
    }
  }

  statsUpdated(newMax)
  {
    if(newMax > this.maxStat) 
    {
      this.maxStat = newMax;
      if(this.team && this.team.options) 
      {
        this.team.options = {...this.team.options, maxStat: this.maxStat}
      }
    }
  }

  copyRentalCode()
  {
    if(this.team?.rentalCode)
    {
      this.rentalCodeCopied = true;
      this.util.copyToClipboard(this.team?.rentalCode);
      setTimeout(()=>
      {
        this.rentalCodeCopied = false;
      }, 1000);
    }
  }

  toggleIVs()
  {
    if(this.team?.options)
    {
      this.team.options.showIVs = !this.team.options.showIVs
    }
  }

  toggleEVs()
  {
    if(this.team?.options)
    {
      this.team.options.showEVs = !this.team.options.showEVs
    }
  }

  toggleNatures()
  {
    if(this.team?.options)
    {
      this.team.options.showNature = !this.team.options.showNature
    }
  }
}
