import { Component, EventEmitter, inject, Input, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FeedbackColors } from 'src/app/core/config/models/colors';
import { selectTheme } from 'src/app/core/config/store/config.selectors';
import { PokemonPreview } from 'src/app/features/pokemon/models/pokemonPreview.model';
import { Layout } from 'src/app/features/search/models/layout.enum';
import { TeamService } from 'src/app/features/team/services/team.service';
import { User } from 'src/app/features/user/models/user.model';
import { ParserService } from 'src/app/shared/services/parser.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { PokemonPreviewComponent } from '../../../pokemon/components/pokemon-preview/pokemon-preview.component';
import { TeamPreviewData } from '../../models/teamPreviewData.model';

@Component({
  selector: 'app-team-preview',
  templateUrl: './team-preview.component.html',
  styleUrls: ['./team-preview.component.scss']
})
export class TeamPreviewComponent 
{
  teamService = inject(TeamService);
  parser = inject(ParserService);
  util = inject(UtilService);
  store = inject(Store);

  @Input() team?: TeamPreviewData;
  @Input() pokemons?: PokemonPreview[] | null = undefined;
  @Input() layout?: Layout;
  @Input() logged?: User;
  @Output() deleteEvent = new EventEmitter();
  
  @ViewChildren(PokemonPreviewComponent) pokemonPreviewsComponents!: QueryList<PokemonPreviewComponent>;

  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  selectedThemeName?: string;

  feedback: string | undefined = undefined;
  readonly feedbackColors = FeedbackColors;
  deleteDialog: boolean = false;

  async ngOnInit()
  {
    this.selectedTheme$.subscribe((value) =>
    {
      if(value)
      {
        this.selectedThemeName = value;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes["team"])
    {
      if(this.team && this.team?.pokemonIDs && this.team?.pokemonIDs.length > 0)
      {
        this.loadPokemons(this.team?.id)
      }
    }
  }

  loadPokemons(teamId: string)
  {
    this.teamService.getTeamPokemonPreviews(teamId).subscribe(
      {
        next: (response) =>
        {
          if(response)
          {
            this.pokemons = response;
          }
        },
        error: () => 
        {
          this.pokemons = null;
        }
      }
    );
  }

  getVisibility()
  {
    return this.logged ? true : this.team?.visibility;
  }

  expand()
  {
    this.pokemonPreviewsComponents.forEach(pokemon => 
    {
      pokemon.expand();
    });
  }
  
  copyPaste()
  {
    if(this.team?.pokemonIDs)
    {
      //copyToClipboard(this.parser.reversePaste(this.team?.pokemons));
    }
  }

  copyLink()
  {
    if(this.team)
    {
      this.util.copyToClipboard("http://localhost:4200/" + this.team.id);
    }
  }

  tryDelete()
  {
    this.deleteDialog = !this.deleteDialog;
  }

  deleteChooseEvent($event)
  {
    if($event)
    {
      this.delete();
      this.deleteDialog = !this.deleteDialog;
    }
    else
    {
      this.deleteDialog = !this.deleteDialog;
    }
  }

  delete()
  {
    if(this.team 
      && this.logged 
      && this.logged.username == this.team?.player?.username 
      && this.team?.player?.registered) 
    {
      this.teamService.deleteTeam(this.team?.id).subscribe(
        {
          next: (response) =>
          {
            this.deleteEvent.emit();
          },
          error: (error) =>
          {
            console.log("Error deleting team: ", error.message)
            this.feedback = error.message;
          }
        }
      )
    }
  }
}
