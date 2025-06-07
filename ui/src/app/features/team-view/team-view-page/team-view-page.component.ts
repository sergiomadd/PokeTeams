import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ParserService } from 'src/app/core/helpers/parser.service';
import { SeoService } from 'src/app/core/helpers/seo.service';
import { UtilService } from 'src/app/core/helpers/util.service';
import { WindowService } from 'src/app/core/helpers/window.service';
import { CustomError } from 'src/app/core/models/misc/customError.model';
import { Team } from 'src/app/core/models/team/team.model';
import { TeamData } from 'src/app/core/models/team/teamData.model';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { TeamService } from 'src/app/core/services/team.service';
import { selectLoggedUser } from 'src/app/core/store/auth/auth.selectors';
import { selectLang } from 'src/app/core/store/config/config.selectors';
import { environment } from 'src/environments/environment';
import { User } from '../../user/models/user.model';

@Component({
  selector: 'app-team-view-page',
  templateUrl: './team-view-page.component.html',
  styleUrl: './team-view-page.component.scss'
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
    if(this.team && this.team?.player?.registered
      && this.loggedUser && this.loggedUser.username == this.team?.player?.username) 
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
    else if(!this.team?.player?.registered)
    {
      this.feedback = "Unauthorized";
    }
    else if(!this.loggedUser || (this.loggedUser && this.loggedUser.username != this.team?.player?.username))
    {
      this.feedback = "Unauthorized";
    }
  }
}
