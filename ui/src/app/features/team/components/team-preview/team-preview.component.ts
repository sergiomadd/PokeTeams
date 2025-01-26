import { Component, EventEmitter, inject, Input, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Store } from '@ngrx/store';
import { forkJoin, Observable } from 'rxjs';
import { FeedbackColors } from 'src/app/core/config/models/colors';
import { selectTheme } from 'src/app/core/config/store/config.selectors';
import { WindowService } from 'src/app/core/layout/mobile/window.service';
import { Pokemon } from 'src/app/features/pokemon/models/pokemon.model';
import { PokemonPreview } from 'src/app/features/pokemon/models/pokemonPreview.model';
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
  window = inject(WindowService);

  @Input() team?: TeamPreviewData;
  @Input() pokemons?: PokemonPreview[] | null = undefined;
  @Input() logged?: User;
  @Output() deleteEvent = new EventEmitter();
  
  @ViewChildren(PokemonPreviewComponent) pokemonPreviewsComponents!: QueryList<PokemonPreviewComponent>;

  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  selectedThemeName?: string;

  feedback: string | undefined = undefined;
  readonly feedbackColors = FeedbackColors;
  deleteDialog: boolean = false;
  copying?: boolean;
  copied?: boolean;
  linkCopied: boolean = false;

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

  expand()
  {
    this.pokemonPreviewsComponents.forEach(pokemon => 
    {
      pokemon.expand();
    });
  }
  
  async copyPaste()
  {
    this.copying = true;
    this.copied = undefined;
    if(this.team?.pokemonIDs)
    {
      let pokemonObservables: Observable<Pokemon>[] = [];
      for (const id of this.team?.pokemonIDs) 
      {
        pokemonObservables.push(this.teamService.getPokemonByIdNoLang(id));
      }
      forkJoin(pokemonObservables).subscribe(
        {
          next: (response) => 
          {
            if(this.util.copyToClipboard(this.parser.reversePaste(response)))
            {
              this.copied = true;
            }
            else
            {
              this.copied = false;
            }
            this.copying = false;
          },
          error: () => 
          {
            this.copied = false;
            this.copying = false;
          }
        });
    }
  }

  copyLink()
  {
    this.linkCopied = true;
    if(this.team)
    {
      this.util.copyToClipboard("http://localhost:4200/" + this.team.id);
      setTimeout(()=>
      {
        this.linkCopied = false;
      }, 300);
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
      && this.team?.player?.registered
      && this.logged 
      && this.logged.username == this.team?.player?.username) 
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
    else if(!this.team?.player?.registered)
    {
      this.feedback = "Unauthorized";
    }
    else if(!this.logged || (this.logged && this.logged.username != this.team?.player?.username))
    {
      this.feedback = "Unauthorized";
    }
  }
}
