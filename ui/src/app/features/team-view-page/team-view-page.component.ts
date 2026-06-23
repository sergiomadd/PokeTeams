import { NgStyle } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map, Observable, startWith } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ParserService } from '../../core/helpers/parser.service';
import { SeoService } from '../../core/helpers/seo.service';
import { UtilService } from '../../core/helpers/util.service';
import { WindowService } from '../../core/helpers/window.service';
import { CustomError } from '../../core/models/misc/customError.model';
import { Team } from '../../core/models/team/team.model';
import { TeamData } from '../../core/models/team/teamData.model';
import { User } from '../../core/models/user/user.model';
import { PokemonService } from '../../core/services/pokemon.service';
import { TeamService } from '../../core/services/team.service';
import { selectLoggedUser } from '../../core/store/auth/auth.selectors';
import { selectLang } from '../../core/store/config/config.selectors';
import { DialogComponent } from '../../shared/components/dumb/dialog/dialog.component';
import { NotFoundComponent } from '../../shared/components/dumb/not-found/not-found.component';
import { TooltipComponent } from '../../shared/components/dumb/tooltip/tooltip.component';
import { TeamComponent } from '../../shared/components/team/team/team.component';
import { TeamOptions } from '../../core/models/team/teamOptions.model';

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

  loggedUser = this.store.selectSignal(selectLoggedUser)
  selectedLang = this.store.selectSignal(selectLang)

  url = toSignal(this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd), map(() => this.router.url), startWith(this.router.url)), { initialValue: this.router.url})
  teamKey = signal<string>(this.router.url.slice(1));
  team = signal<Team | undefined>(undefined);
  teamData = signal<TeamData | undefined>(undefined);
  loading = signal<boolean>(false);
  viewIncrementCooldown = signal<number>(1);
  feedback = signal<string | undefined>(undefined);

  pasteCopied = signal<boolean>(false);
  linkCopied = signal<boolean>(false);
  unauthorized = signal<boolean>(false);
  deleteDialog = signal<boolean>(false);

  constructor()
  {
    this.triggerViewCount();

    effect(() => 
    {
      const teamKey = this.router.url.slice(1); 
      this.teamKey.set(teamKey);

      this.seo.updateMetaData({
        title: `${this.team()?.title || 'PokeTeam'}`,
        description: 'Display the pokemon team information in a visually engaging ui. With the option to copy the pokepaste of the team.',
        slug: this.teamKey(),
      });
    })

    effect(() => 
    {
      this.selectedLang();
      this.loadTeam();
    })
  }

  loadTeam()
  {
    this.loading.set(true);
    this.teamService.getTeamData(this.teamKey()).subscribe(
      {
        next: (response) => 
        {
          this.teamData.set(response);
          const teamData = this.teamData();
          if(teamData)
          {
            this.team.set( 
            {
              ...this.team,
              pokemons: [],
              id: teamData.id,
              options: teamData.options,
              player: teamData.player,
              user: teamData.user,
              title: teamData.title,
              tournament: teamData.tournament,
              regulation: teamData.regulation,
              rentalCode: teamData.rentalCode,
              viewCount: teamData.viewCount,
              date: teamData.date,
              visibility: teamData.visibility,
              tags: teamData.tags,
            });
            this.initOptions();
            this.loadPokemonPlaceholders(teamData.pokemonIDs)
            this.loadPokemons(teamData.pokemonIDs);
          }
        },
        error: (error: CustomError) =>
        {
          this.loading.set(false);
          if(error.status === 401)
          {
            this.unauthorized.set(true);
          }
        },
        complete: () => 
        {
          this.loading.set(false);
        }
      }
    );
  }

  loadPokemonPlaceholders(pokemonIDs: number[])
  {
    let team = this.team();
    if(team)
    {
      for (const pokemonID in pokemonIDs) 
      {
        team.pokemons.push(undefined);
      }
    }
  }

  async loadPokemons(pokemonIDs: number[])
  {
    pokemonIDs.map(async (pokemonID, index) => 
    {
      this.pokemonService.getPokemonById(pokemonID).subscribe(
        {
          next: (response) =>
          {
            if(response) 
            { 
              this.team.update(team => team && { ...team, pokemons: team.pokemons.map((pokemon, pokemonIndex) =>
                pokemonIndex === index ? response : pokemon )})
            }
          },
          error: () =>
          {
            this.team.update(team => team && { ...team, pokemons: team.pokemons.map((pokemon, pokemonIndex) =>
              pokemonIndex === index ? null : pokemon )})
          }
        }
      );
    })
  }

  triggerViewCount()
  {
    const item = sessionStorage.getItem(this.teamKey());
    if(item)
    {
      const lastTime = parseInt(item);
      if(this.util.haveMinutesPassed(lastTime, this.viewIncrementCooldown()))
      {
        this.teamService.incrementViewCount(this.teamKey());
        const time = new Date().getTime();
        sessionStorage.setItem(this.teamKey(), time.toString());
      }
    }
    else
    {
      this.teamService.incrementViewCount(this.teamKey());
      const time = new Date().getTime();
      sessionStorage.setItem(this.teamKey(), time.toString());
    }
  }

  copyPaste()
  {
    this.pasteCopied.set(true);
    if(this.team()?.pokemons)
    {
      this.util.copyToClipboard(this.parser.reversePaste(this.team()?.pokemons ?? []));
      setTimeout(()=>
      {
        this.pasteCopied.set(false);
      }, 1000);
    }
  }

  copyLink()
  {
    this.linkCopied.set(true);
    this.util.copyToClipboard(environment.url + this.teamKey);
    setTimeout(()=>
    {
      this.linkCopied.set(false);
    }, 1000);
  }

  editTeam()
  {
    
  }

  initOptions()
  {
    this.team.update(team => team && { ...team, options: { ...team.options, showIVs: false, showEVs: false, showNature: true }})
  }

  tryDelete()
  {
    this.deleteDialog.update(value => !value);
  }

  deleteChooseEvent($event)
  {
    if($event)
    {
      this.delete();
    }
    this.deleteDialog.update(value => !value);
  }

  delete()
  {
    const team = this.team();
    if(!team) { return; }
    if(team.user?.registered && this.loggedUser()?.username == team.user?.username) 
    {
      this.teamService.deleteTeam(team.id).subscribe(
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
    else if(!team.user?.registered)
    {
      this.feedback.set("Unauthorized");
    }
    else if(!this.loggedUser() || (this.loggedUser() && this.loggedUser()?.username != team.user?.username))
    {
      this.feedback.set("Unauthorized");
    }
  }
}
