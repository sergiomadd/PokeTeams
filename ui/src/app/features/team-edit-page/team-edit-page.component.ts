import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { CustomError } from '../../core/models/misc/customError.model';
import { Team } from '../../core/models/team/team.model';
import { TeamData } from '../../core/models/team/teamData.model';
import { PokemonService } from '../../core/services/pokemon.service';
import { TeamService } from '../../core/services/team.service';
import { selectLang } from '../../core/store/config/config.selectors';
import { PokemonEditorComponent } from '../../shared/components/pokemon/pokemon-editor/pokemon-editor.component';
import { TeamEditorComponent } from '../../shared/components/team/team-editor/team-editor.component';
import { TeamEditorService } from '../../shared/services/team-editor.service';

@Component({
    selector: 'app-team-edit-page',
    templateUrl: './team-edit-page.component.html',
    styleUrl: './team-edit-page.component.scss',
    imports: [PokemonEditorComponent, TeamEditorComponent, TranslatePipe]
})
export class TeamEditPageComponent
{
  teamService = inject(TeamService);
  pokemonService = inject(PokemonService);
  router = inject(Router);
  teamEditorService = inject(TeamEditorService)
  store = inject(Store);

  selectedLang = this.store.selectSignal(selectLang);

  teamKey = signal<string>(this.router.url.slice(6));
  team = signal<Team>(<Team>{});
  teamData = signal<TeamData | undefined>(undefined);
  feedback = signal<string | undefined>(undefined);
  teamSubmitted = signal<boolean>(false);
  loading = signal<boolean>(false);

  constructor()
  {
    effect(() =>
    {
      this.selectedLang();
      this.loadTeam();
    })
  }

  saveTeam()
  {
    const team = this.team();
    if(team)
    {
      const feedback = this.teamEditorService.validateTeam(team);
      this.feedback.set(feedback);
      if(!feedback)
      {
        this.teamSubmitted.set(true);
        this.teamService.updateTeam(team).subscribe(
          {
            next: (response: string) =>
            {
              this.teamSubmitted.set(false);
              if(response)
              {
                this.router.navigate(['/', response])
              }
              this.feedback.set(undefined);
            },
            error: (error: CustomError) =>
            {
              this.teamSubmitted.set(false);
              this.feedback.set(error.message);
            }
          }
        )
      }
    }
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
              ...this.team(),
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
            this.teamEditorService.setTeam(this.team());
          }
        },
        error: (error) =>
        {
          this.loading.set(false);
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
    const team = this.team();
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
    const team = this.team();
    if(team)
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
                this.teamEditorService.setTeam(this.team());
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
  }

  initOptions()
  {
    this.team.update(team => team && { ...team, options: { ...team.options, showIVs: true, showEVs: true, showNature: true }})
  }
}
