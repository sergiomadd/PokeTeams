import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomError } from 'src/app/core/models/misc/customError.model';
import { Team } from 'src/app/core/models/team/team.model';
import { TeamData } from 'src/app/core/models/team/teamData.model';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { TeamService } from 'src/app/core/services/team.service';
import { selectLang } from 'src/app/core/store/config/config.selectors';
import { TeamEditorService } from '../../../shared/services/team-editor.service';

@Component({
  selector: 'app-team-edit-page',
  templateUrl: './team-edit-page.component.html',
  styleUrl: './team-edit-page.component.scss'
})
export class TeamEditPageComponent 
{
  teamService = inject(TeamService);
  pokemonService = inject(PokemonService);
  router = inject(Router);
  teamEditorService = inject(TeamEditorService)
  store = inject(Store);

  selectedLang$: Observable<string> = this.store.select(selectLang);

  teamKey: string = "";
  team: Team = <Team>{};
  teamData?: TeamData;
  feedback?: string;
  teamSubmitted: boolean = false;
  loading: boolean = false;

  async ngOnInit()
  {
    this.teamKey = this.router.url.slice(6);
    this.teamEditorService.selectedTeam$.subscribe((value) => 
    {
      this.team = value;
    });
    this.selectedLang$.subscribe(value =>
      {
        this.loadTeam();
      });
  }

  saveTeam()
  {
    if(this.team)
    {
      this.feedback = this.teamEditorService.validateTeam(this.team);
      if(!this.feedback)
      {
        this.teamSubmitted = true;
        this.teamService.updateTeam(this.team).subscribe(
          {
            next: (response: string) =>
            {
              this.teamSubmitted = false;
              if(response)
              {
                this.router.navigate(['/', response])
              }
              this.feedback = undefined;
            },
            error: (error: CustomError) => 
            {
              this.teamSubmitted = false;
              this.feedback = error.message;
            }
          }
        )
      }
    }
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
            this.teamEditorService.setTeam(this.team);
          }
        },
        error: (error) =>
        {
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
        this.pokemonService.getPokemonById(pokemonID).subscribe(
          {
            next: (response) =>
            {
              if(this.team && response) 
              { 
                this.team.pokemons[index] = response;
                this.teamEditorService.setTeam(this.team);
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

  initOptions()
  {
    if(this.team)
    {

      this.team.options.showIVs = true;
      this.team.options.showEVs = true;
      this.team.options.showNature = true;
    }
  }
}
