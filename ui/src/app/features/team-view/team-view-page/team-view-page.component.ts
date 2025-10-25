import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ParserService } from '../../../core/helpers/parser.service';
import { SeoService } from '../../../core/helpers/seo.service';
import { UtilService } from '../../../core/helpers/util.service';
import { WindowService } from '../../../core/helpers/window.service';
import { CustomError } from '../../../core/models/misc/customError.model';
import { Team } from '../../../core/models/team/team.model';
import { TeamData } from '../../../core/models/team/teamData.model';
import { PokemonService } from '../../../core/services/pokemon.service';
import { TeamService } from '../../../core/services/team.service';
import { selectLoggedUser } from '../../../core/store/auth/auth.selectors';
import { selectLang } from '../../../core/store/config/config.selectors';
import { User } from '../../user/models/user.model';
import { NgStyle } from '@angular/common';
import { TeamComponent } from '../../../shared/components/team/team/team.component';
import { TooltipComponent } from '../../../shared/components/dumb/tooltip/tooltip.component';
import { NotFoundComponent } from '../../../shared/components/dumb/not-found/not-found.component';
import { DialogComponent } from '../../../shared/components/dumb/dialog/dialog.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-team-view-page',
    templateUrl: './team-view-page.component.html',
    styleUrl: './team-view-page.component.scss',
    imports: [NgStyle, TeamComponent, TooltipComponent, RouterLink, NotFoundComponent, DialogComponent, TranslatePipe]
})
export class TeamViewPageComponent 
{
  teamService = inject(TeamService);
  pokemonService = inject(PokemonService);
  router = inject(Router);
  util = inject(UtilService);
  parser = inject(ParserService);
  store = inject(Store);
  window = inject(WindowService);
  seo = inject(SeoService);

  loggedUser$: Observable<User | null> = this.store.select(selectLoggedUser);
  loggedUser?: User;
  selectedLang$: Observable<string> = this.store.select(selectLang);

  teamKey: string = "";
  team?: Team;
  teamData?: TeamData;
  loading: boolean = false;
  viewIncrementCooldown: number = 1;
  feedback: string | undefined = undefined;

  pasteCopied: boolean = false;
  linkCopied: boolean = false;
  unauthorized: boolean = false;
  deleteDialog: boolean = false;

  async ngOnInit()
  {
    this.teamKey = this.router.url.slice(1);

    this.seo.updateMetaData({
      title: `${this.team?.title || 'PokeTeam'}`,
      description: 'Display the pokemon team information in a visually engaging ui. With the option to copy the pokepaste of the team.',
      slug: this.teamKey,
    });

    this.loggedUser$.subscribe(value =>
      {
        this.loggedUser = value ?? undefined;
      });
    this.selectedLang$.subscribe(value =>
      {
        this.loadTeam();
      });

    this.triggerViewCount();
  }

  loadTeam()
  {
    this.loading = true;
    this.teamService.getTeamData(this.teamKey).subscribe(
      {
        next: (response) => 
        {
          this.teamData = response;
          if(this.teamData)
          {
            this.team = 
            {
              ...this.team,
              pokemons: [],
              id: this.teamData.id,
              options: this.teamData.options,
              player: this.teamData.player,
              user: this.teamData.user,
              title: this.teamData.title,
              tournament: this.teamData.tournament,
              regulation: this.teamData.regulation,
              rentalCode: this.teamData.rentalCode,
              viewCount: this.teamData.viewCount,
              date: this.teamData.date,
              visibility: this.teamData.visibility,
              tags: this.teamData.tags,
            };
            this.initOptions();
            this.loadPokemonPlaceholders(this.teamData.pokemonIDs)
            this.loadPokemons(this.teamData.pokemonIDs);
          }
        },
        error: (error: CustomError) =>
        {
          this.loading = false;
          if(error.status === 401)
          {
            this.unauthorized = true;
          }
        },
        complete: () => 
        {
          this.loading = false;
        }
      }
    );
  }

  loadPokemonPlaceholders(pokemonIDs: number[])
  {
    for (const pokemonID in pokemonIDs) 
    {
      this.team?.pokemons.push(undefined);
    }
  }

  async loadPokemons(pokemonIDs: number[])
  {
    if(this.team)
    {
      pokemonIDs.map(async (pokemonID, index) => 
      {
        this.pokemonService.getPokemonById(pokemonID).subscribe(
          {
            next: (response) =>
            {
              if(this.team && response) 
              { 
                this.team.pokemons[index] = response;
                this.team = {...this.team, pokemons: this.team.pokemons}
              }
            },
            error: () =>
            {
              if(this.team) 
              { 
                this.team.pokemons[index] = null;
                this.team = {...this.team, pokemons: this.team.pokemons}
              }            
            }
          }
        );
      })
    }
  }

  triggerViewCount()
  {
    const item = sessionStorage.getItem(this.teamKey);
    if(item)
    {
      const lastTime = parseInt(item);
      if(this.util.haveMinutesPassed(lastTime, this.viewIncrementCooldown))
      {
        this.teamService.incrementViewCount(this.teamKey);
        const time = new Date().getTime();
        sessionStorage.setItem(this.teamKey, time.toString());
      }
    }
    else
    {
      this.teamService.incrementViewCount(this.teamKey);
      const time = new Date().getTime();
      sessionStorage.setItem(this.teamKey, time.toString());
    }
  }

  copyPaste()
  {
    this.pasteCopied = true;
    if(this.team && this.team.pokemons)
    {
      this.util.copyToClipboard(this.parser.reversePaste(this.team.pokemons ?? []));
      setTimeout(()=>
      {
        this.pasteCopied = false;
      }, 1000);
    }
  }

  copyLink()
  {
    this.linkCopied = true;
    this.util.copyToClipboard(environment.url + this.teamKey);
    setTimeout(()=>
    {
      this.linkCopied = false;
    }, 1000);
  }

  editTeam()
  {
    
  }

  initOptions()
  {
    if(this.team)
    {
      this.team.options.showIVs = true;
      this.team.options.showEVs = true;
      this.team.options.showNature = true;
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
    if(this.team && this.team?.user?.registered
      && this.loggedUser && this.loggedUser.username == this.team?.user?.username) 
    {
      this.teamService.deleteTeam(this.team?.id).subscribe(
        {
          next: () =>
          {
            this.router.navigate(['/']);
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
    else if(!this.loggedUser || (this.loggedUser && this.loggedUser.username != this.team?.user?.username))
    {
      this.feedback = "Unauthorized";
    }
  }
}
