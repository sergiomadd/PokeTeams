import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Team } from 'src/app/features/team/models/team.model';
import { TeamService as NewTeamService, TeamService } from 'src/app/features/team/services/team.service';
import { ParserService } from 'src/app/shared/services/parser.service';
import { UtilService } from 'src/app/shared/services/util.service';

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
  newTeamService = inject(NewTeamService)

  teamKey: string = "";
  team?: Team;
  loading: boolean = false;
  viewIncrementCooldown: number = 1;

  async ngOnInit()
  {
    this.teamKey = this.router.url.slice(1);
    this.loading = true;
    this.teamService.getTeam(this.teamKey).subscribe(
      {
        next: (response) => 
        {
          console.log("response", response)
          this.team = response;
        },
        error: (error) =>
        {
          console.log("error getting team", error)
          this.loading = false;
        },
        complete: () => 
        {
          this.loading = false;
        }
      }
    );
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
    if(this.team)
    {
      this.util.copyToClipboard(this.parser.reversePaste(this.team.pokemons));
    }
  }

  copyLink()
  {
    const path: string = "http://localhost:4200/"
    this.util.copyToClipboard(path + this.teamKey);
  }
}
