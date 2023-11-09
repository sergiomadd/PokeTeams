import { Component, inject } from '@angular/core';
import { Team } from 'src/app/models/team.model';
import { GenerateTeamService } from 'src/app/services/generate-team.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss']
})
export class TeamViewComponent 
{
  teamService = inject(GenerateTeamService);
  router = inject(Router)


  ngOnInit() 
  {
    let team: Promise<Team> = this.teamService.getTeam(this.router.url);
  }
}
