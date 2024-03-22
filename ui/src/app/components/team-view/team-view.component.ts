import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Team } from 'src/app/models/team.model';
import { GenerateTeamService } from 'src/app/services/generate-team.service';

@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss']
})

//njw8dvel6o id
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
