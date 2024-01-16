import { Component, inject } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import { GenerateTeamService } from 'src/app/services/generate-team.service';
import { Router } from '@angular/router';
import { Pokemon } from 'src/app/models/pokemon.model';
import { EditorOptions } from 'src/app/models/editorOptions.model';

@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss']
})

//njw8dvel6o id
export class TeamViewComponent 
{
  teamService = inject(GenerateTeamService);
  router = inject(Router)

  team: Team = <Team>{};
  pokemons: Pokemon[] | undefined = [];
  editorOptions: EditorOptions | undefined = <EditorOptions>{};

  async ngOnInit() 
  {
    this.team = await this.teamService.getTeam(this.router.url);
    this.pokemons = this.team.pokemons;
    this.editorOptions = this.team.options;
  }

  copy()
  {

  }

  generateImage()
  {

  }

  share()
  {

  }
}
