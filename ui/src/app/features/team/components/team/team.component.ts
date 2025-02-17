import { Component, EventEmitter, inject, Input, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ThemeService } from 'src/app/core/config/services/theme.service';
import { WindowService } from 'src/app/core/layout/mobile/window.service';
import { Tag } from 'src/app/features/team/models/tag.model';
import { Team } from 'src/app/features/team/models/team.model';
import { TeamOptions } from 'src/app/features/team/models/teamOptions.model';
import { ParserService } from 'src/app/shared/services/parser.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { PokemonComponent } from '../../../pokemon/components/pokemon/pokemon.component';


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

  @ViewChildren(PokemonComponent) pokemonComponents!:QueryList<PokemonComponent>;

  showAllStats: boolean = false;
  showAllNotes: boolean = false;
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
      this.team.options.showEVs = this.team?.options.evsVisibility;
      this.team.options.showNature = this.team?.options.naturesVisibility;
    }
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
          pokemon.showNotes[0] = this.showAllNotes;
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
