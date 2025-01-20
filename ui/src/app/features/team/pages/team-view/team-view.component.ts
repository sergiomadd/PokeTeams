import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectLang } from 'src/app/core/config/store/config.selectors';
import { WindowService } from 'src/app/core/layout/mobile/window.service';
import { Team } from 'src/app/features/team/models/team.model';
import { TeamService } from 'src/app/features/team/services/team.service';
import { ParserService } from 'src/app/shared/services/parser.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { TeamData } from '../../models/teamData.model';

@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss']
})

export class TeamViewComponent 
{
  teamService = inject(TeamService);
  router = inject(Router);
  util = inject(UtilService);
  parser = inject(ParserService);
  store = inject(Store);
  window = inject(WindowService);
  
  selectedLang$: Observable<string> = this.store.select(selectLang);

  teamKey: string = "";
  team?: Team;
  teamData?: TeamData;
  loading: boolean = false;
  viewIncrementCooldown: number = 1;

  pasteCopied: boolean = false;
  linkCopied: boolean = false;

  async ngOnInit()
  {
    this.teamKey = this.router.url.slice(1);
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
              tournament: this.teamData.tournament,
              regulation: this.teamData.regulation,
              viewCount: this.teamData.viewCount,
              date: this.teamData.date,
              visibility: this.teamData.visibility,
              tags: this.teamData.tags,
            };
            this.loadPokemonPlaceholders(this.teamData.pokemonIDs)
            this.loadPokemons(this.teamData.pokemonIDs);
          }
        },
        error: (error) =>
        {
          console.log("Error getting team data", error)
          this.loading = false;
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
        this.teamService.getPokemonById(pokemonID).subscribe(
          {
            next: (response) =>
            {
              if(this.team && response) 
              { 
                this.team.pokemons[index] = response;
              }
            },
            error: () =>
            {
              if(this.team) 
              { 
                this.team.pokemons[index] = null;
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
    const path: string = "http://localhost:4200/"
    this.util.copyToClipboard(path + this.teamKey);
    setTimeout(()=>
    {
      this.linkCopied = false;
    }, 1000);
  }
}
