import { Component, inject, input, model, SimpleChanges, output, viewChildren } from '@angular/core';
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

  readonly team = input<TeamPreviewData>();
  readonly pokemons = model<PokemonPreview[] | null>([]);
  readonly logged = input<User>();
  readonly deleteEvent = output();
  readonly compareEvent = output<TeamPreviewToCompare>();
  
  readonly pokemonPreviewsComponents = viewChildren(PokemonPreviewComponent);

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
      const team = this.team();
      if(team && team?.pokemonIDs && team?.pokemonIDs.length > 0)
      {
        this.loadPokemons(team?.id)
      }
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

  loadPokemons(teamId: string)
  {
    this.pokemonService.getTeamPokemonPreviews(teamId).subscribe(
      {
        next: (response) =>
        {
          if(response)
          {
            this.pokemons.set(response);
          }
        },
        error: () => 
        {
          this.pokemons.set(null);
        }
      }
    );
  }

  expand()
  {
    this.pokemonPreviewsComponents().forEach(pokemon => 
    {
      pokemon.expand();
    });
  }
  
  async copyPaste()
  {
    this.copying = true;
    this.copied = undefined;
    const team = this.team();
    if(team?.pokemonIDs)
    {
      let pokemonObservables: Observable<Pokemon>[] = [];
      for (const id of team?.pokemonIDs) 
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
    const team = this.team();
    if(team)
    {
      this.util.copyToClipboard(environment.url + team.id);
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
    const team = this.team();
    const logged = this.logged();
    if(team 
      && team?.user?.registered
      && logged 
      && logged.username == team?.user?.username) 
    {
      this.teamService.deleteTeam(team?.id).subscribe(
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
    else if(!team?.user?.registered)
    {
      this.feedback = "Unauthorized";
    }
    else if(!logged || (logged && logged.username != team?.user?.username))
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
    const team = this.team();
    const pokemons = this.pokemons();
    if(team?.id && pokemons)
    {
      const compareTeam: TeamPreviewToCompare = {teamData: team, pokemonPreviews: pokemons ?? []}
      const compareAddResult: boolean = this.compareService.addTeamsToCompare(compareTeam);
      if(!compareAddResult)
      {
        this.feedback = this.i18n.translateKey('team.compare.to_compare_too_many');
      }
    }
  }
}
