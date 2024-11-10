import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TeamEditorService } from 'src/app/features/team/services/team-editor.service';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-team-edit',
  templateUrl: './team-edit.component.html',
  styleUrl: './team-edit.component.scss'
})
export class TeamEditComponent 
{
  teamService = inject(TeamService);
  router = inject(Router);
  teamEditorService = inject(TeamEditorService)

  teamKey: string = "";

  async ngAfterContentInit()
  {
    this.teamKey = this.router.url.slice(6);
    this.teamEditorService.setTeam(await this.teamService.getTeam(this.teamKey));
  }
}
