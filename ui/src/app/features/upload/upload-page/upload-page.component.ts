import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CustomError } from 'src/app/core/models/misc/customError.model';
import { Team } from 'src/app/core/models/team/team.model';
import { TeamSaveResponse } from 'src/app/core/models/team/teamSaveResponse.model';
import { TeamService } from 'src/app/core/services/team.service';
import { selectLoggedUser } from 'src/app/core/store/auth/auth.selectors';
import { TeamEditorService } from '../../team/services/team-editor.service';
import { User } from '../../user/models/user.model';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrl: './upload-page.component.scss'
})
export class UploadPageComponent 
{
  router = inject(Router);
  teamService = inject(TeamService);
  teamEditorService = inject(TeamEditorService);
  store = inject(Store);

  loggedUser: User | null = null;
  user$ = this.store.select(selectLoggedUser);

  team: Team = <Team>{};
  feedback?: string;
  teamSubmitted: boolean = false;

  async ngOnInit() 
  {
    this.teamEditorService.selectedTeam$.subscribe((value) => 
    {
      this.team = value;
    });
    this.user$.subscribe((value) => 
    {
      this.loggedUser = value;
    });
  }

  async saveTeam()
  {
    this.feedback = this.teamEditorService.validateTeam(this.team);
    if(!this.feedback)
    {
      console.log("Saving team: ", this.team);
      this.teamSubmitted = true;
      if(this.loggedUser)
      {
        this.teamService.saveTeam(this.team).subscribe(
          {
            next: (response: TeamSaveResponse) =>
            {
              this.teamSubmitted = false;
              console.log("Team response: ", response)
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
      else
      {
        this.teamService.saveTeamAnon(this.team).subscribe(
          {
            next: (response: TeamSaveResponse) =>
            {
              this.teamSubmitted = false;
              console.log("Team response: ", response)
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
