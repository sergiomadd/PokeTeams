import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SeoService } from '../../../core/helpers/seo.service';
import { CustomError } from '../../../core/models/misc/customError.model';
import { Team } from '../../../core/models/team/team.model';
import { TeamService } from '../../../core/services/team.service';
import { selectLoggedUser } from '../../../core/store/auth/auth.selectors';
import { TeamEditorService } from '../../../shared/services/team-editor.service';
import { User } from '../../user/models/user.model';

@Component({
    selector: 'app-upload-page',
    templateUrl: './upload-page.component.html',
    styleUrl: './upload-page.component.scss',
    standalone: false
})
export class UploadPageComponent 
{
  router = inject(Router);
  teamService = inject(TeamService);
  teamEditorService = inject(TeamEditorService);
  store = inject(Store);
  seo = inject(SeoService);

  loggedUser: User | null = null;
  user$ = this.store.select(selectLoggedUser);

  team: Team = <Team>{};
  feedback?: string;
  teamSubmitted: boolean = false;

  async ngOnInit() 
  {
    this.seo.updateMetaData();
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
      this.teamSubmitted = true;
      this.teamService.saveTeam(this.team).subscribe(
        {
          next: (response: string) =>
          {
            this.teamSubmitted = false;
            if(response)
            {
              this.router.navigate(['/', response])
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
