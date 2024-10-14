import { Component, EventEmitter, inject, Input, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
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

  @Input() team?: Team;
  @Input() removableTags?: boolean = false;

  @ViewChildren(PokemonComponent) pokemonComponents!:QueryList<PokemonComponent>;

  showAllStats: boolean = false;
  showAllNotes: boolean = false;
  maxStat: number = 0;

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['team'])
    {
      this.team = changes['team'].currentValue;
    }
  }
  
  
  forceChange(options: TeamOptions)
  {
    console.log("changing", options)
    this.team!.options = structuredClone(options);
  }

  clickOptions(index: number)
  {
    switch(index)
    {
      case 0:
        this.pokemonComponents.forEach(pokemon => 
        {
          pokemon.showStats[0] = !this.showAllStats;
        });
        this.showAllStats = !this.showAllStats;
      break;
      case 1:
        this.pokemonComponents.forEach(pokemon => 
          {
            pokemon.showNotes[0] = !this.showAllNotes;
          });
          this.showAllNotes = !this.showAllNotes;
        break;
      case 2:
        this.team?.pokemons ? this.util.copyToClipboard(this.parser.reversePaste(this.team?.pokemons)):undefined;
        break;
      default: 
      return "";
    }
    return "";
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
      if(this.team) 
      {
        this.team.options = {...this.team.options, maxStat: this.maxStat}
      }
    }
  }
}
