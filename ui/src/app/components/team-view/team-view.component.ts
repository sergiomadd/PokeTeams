import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Team } from 'src/app/models/team.model';
import { TeamService } from 'src/app/services/team.service';
import { UtilService } from 'src/app/services/util.service';

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

  teamKey: string = "";
  team: Team = <Team>{};

  viewIncrementCooldown: number = 1;

  async ngOnInit()
  {
    this.teamKey = this.router.url.slice(1);
    this.team = await this.teamService.getTeam(this.teamKey);
    console.log(this.team)
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
