import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLoggedUser } from 'src/app/core/auth/store/auth.selectors';
import { User } from 'src/app/features/user/models/user.model';
import { CustomError } from 'src/app/shared/models/customError.model';
import { Team } from '../../models/team.model';
import { TeamSaveResponse } from '../../models/teamSaveResponse.model';
import { TeamEditorService } from '../../services/team-editor.service';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent 
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
