import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TeamEditorService } from 'src/app/features/team/services/team-editor.service';
import { CustomError } from 'src/app/shared/models/customError.model';
import { Team } from '../../models/team.model';
import { TeamSaveResponse } from '../../models/teamSaveResponse.model';
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
  team: Team = <Team>{};
  feedback?: string;
  teamSubmitted: boolean = false;

  async ngOnInit() 
  {
    this.teamEditorService.selectedTeam$.subscribe((value) => 
    {
      this.team = value;
    });
  }

  ngAfterContentInit()
  {
    this.teamKey = this.router.url.slice(6);
    this.teamService.getTeam(this.teamKey).subscribe(
      {
        next: (response) => 
        {
          this.teamEditorService.setTeam(response);
        },
        error: (error) =>
        {
          console.log("error getting team editor", error)
        }
      }
    );
  }

  saveTeam()
  {
    if(this.team)
    {
      this.feedback = this.teamEditorService.validateTeam(this.team);
      if(!this.feedback)
      {
        console.log("Updating team: ", this.team);
        this.teamSubmitted = true;
        this.teamService.updateTeam(this.team).subscribe(
          {
            next: (response: TeamSaveResponse) =>
            {
              this.teamSubmitted = false;
              console.log("Team edit response: ", response)
              if(response && response.content)
              {
                this.router.navigate(['/', response.content])
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
}
