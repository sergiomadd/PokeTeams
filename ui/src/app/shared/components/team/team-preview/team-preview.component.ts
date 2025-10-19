import { Component, EventEmitter, inject, Input, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { Store } from '@ngrx/store';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { I18nService } from '../../../../core/helpers/i18n.service';
import { ParserService } from '../../../../core/helpers/parser.service';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { FeedbackColors } from '../../../../core/models/misc/colors';
import { Pokemon } from '../../../../core/models/pokemon/pokemon.model';
import { PokemonPreview } from '../../../../core/models/pokemon/pokemonPreview.model';
import { TeamPreviewData } from '../../../../core/models/team/teamPreviewData.model';
import { TeamPreviewToCompare } from '../../../../core/models/team/teamPreviewToCompare.model';
import { PokemonService } from '../../../../core/services/pokemon.service';
import { TeamService } from '../../../../core/services/team.service';
import { selectTheme } from '../../../../core/store/config/config.selectors';
import { User } from '../../../../features/user/models/user.model';
import { TeamCompareService } from '../../../services/team-compare.service';
import { PokemonPreviewComponent } from '../../pokemon/pokemon-preview/pokemon-preview.component';

@Component({
    selector: 'app-team-preview',
    templateUrl: './team-preview.component.html',
    styleUrls: ['./team-preview.component.scss'],
    standalone: false
})
export class TeamPreviewComponent 
{
  teamService = inject(TeamService);
  pokemonService = inject(PokemonService);
  parser = inject(ParserService);
  util = inject(UtilService);
  store = inject(Store);
  window = inject(WindowService);
  theme = inject(ThemeService);
  compareService = inject(TeamCompareService);
  i18n = inject(I18nService);

  @Input() team?: TeamPreviewData;
  @Input() pokemons?: PokemonPreview[] | null = undefined;
  @Input() logged?: User;
  @Output() deleteEvent = new EventEmitter();
  @Output() compareEvent = new EventEmitter<TeamPreviewToCompare>();
  
  @ViewChildren(PokemonPreviewComponent) pokemonPreviewsComponents!: QueryList<PokemonPreviewComponent>;

  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  selectedThemeName?: string;

  feedback: string | undefined = undefined;
  readonly feedbackColors = FeedbackColors;
  deleteDialog: boolean = false;
  copying?: boolean;
  copied?: boolean;
  linkCopied: boolean = false;
  tooltips: boolean[] = [false, false, false]
  isPlayerSameAsUser: boolean = false;

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
      this.checkUserToPlayer()
    }
  }

  checkUserToPlayer()
  {
    if(this.team && this.team.player?.username && this.team.user
        && (this.team.player.username === this.team.user.username 
          || this.team.player.username === this.team.user.name))
    {
      this.isPlayerSameAsUser = true;
      if(this.team.user.picture)
      {
        this.team.player.picture = this.team.user.picture;
      }
      return;
    }
    this.isPlayerSameAsUser = false;
    if(this.team?.player) { this.team.player.picture = undefined; }
  }  

  loadPokemons(teamId: string)
  {
    this.pokemonService.getTeamPokemonPreviews(teamId).subscribe(
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
        pokemonObservables.push(this.pokemonService.getPokemonByIdNoLang(id));
      }
      forkJoin(pokemonObservables).subscribe(
        {
          next: (response) => 
          {
            if(this.util.copyToClipboard(this.parser.reversePaste(response)))
            {
              this.copied = true;
              setTimeout(() => 
              {
                this.copied = false;
              }, 300);
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
      this.util.copyToClipboard(environment.url + this.team.id);
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
      && this.team?.user?.registered
      && this.logged 
      && this.logged.username == this.team?.user?.username) 
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
    else if(!this.team?.user?.registered)
    {
      this.feedback = "Unauthorized";
    }
    else if(!this.logged || (this.logged && this.logged.username != this.team?.user?.username))
    {
      this.feedback = "Unauthorized";
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

  compare()
  {
    this.feedback = undefined;
    if(this.team?.id && this.pokemons)
    {
      const compareTeam: TeamPreviewToCompare = {teamData: this.team, pokemonPreviews: this.pokemons ?? []}
      const compareAddResult: boolean = this.compareService.addTeamsToCompare(compareTeam);
      if(!compareAddResult)
      {
        this.feedback = this.i18n.translateKey('team.compare.to_compare_too_many');
      }
    }
  }
}
