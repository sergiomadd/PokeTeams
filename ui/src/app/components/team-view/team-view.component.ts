import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Team } from 'src/app/models/team.model';
import { GenerateTeamService } from 'src/app/services/generate-team.service';
import { reverseParsePokemon } from 'src/app/services/parsePaste';

@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss']
})

export class TeamViewComponent 
{
  teamService = inject(GenerateTeamService);
  router = inject(Router);

  teamKey: string = "";
  team: Team = <Team>{};

  async ngOnInit() 
  {
    this.teamKey = this.router.url.slice(1);
    await this.teamService.incrementViewCount(this.teamKey);
    this.team = await this.teamService.getTeam(this.teamKey);
    console.log(this.team)
    if(this.team.pokemons)
    {
      this.team.pokemons.forEach(pokemon => 
        {
          reverseParsePokemon(pokemon);
      });
    }
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
