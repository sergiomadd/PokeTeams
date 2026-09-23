import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { SeoService } from '../../core/helpers/seo.service';
import { CustomError } from '../../core/models/misc/customError.model';
import { TeamService } from '../../core/services/team.service';
import { selectLoggedUser } from '../../core/store/auth/auth.selectors';
import { PasteInputComponent } from '../../shared/components/team/paste-input/paste-input.component';
import { TeamEditorComponent } from '../../shared/components/team/team-editor/team-editor.component';
import { TeamEditorService } from '../../shared/services/team-editor.service';

@Component({
    selector: 'app-upload-page',
    templateUrl: './upload-page.component.html',
    styleUrl: './upload-page.component.scss',
    imports: [PasteInputComponent, TeamEditorComponent, TranslatePipe]
})
export class UploadPageComponent 
{
  router = inject(Router);
  teamService = inject(TeamService);
  teamEditorService = inject(TeamEditorService);
  store = inject(Store);
  seo = inject(SeoService);

  loggedUser = this.store.selectSignal(selectLoggedUser);

  team = this.teamEditorService.team;
  feedback = signal<string | undefined>(undefined);
  teamSubmitted = signal<boolean>(false);

  constructor()
  {
    this.seo.updateMetaData();
  }

  async saveTeam()
  {
    const team = this.team();
    if(!team) { return; }
    const feedback = this.teamEditorService.validateTeam(team);
    this.feedback.set(feedback);
    if(feedback)
    {
      return;
    }
    this.teamSubmitted.set(true)
      this.teamService.saveTeam(team).subscribe(
        {
          next: (response: string) =>
          {
            this.teamSubmitted.set(false);
            if(response)
            {
              this.router.navigate(['/', response])
            }
            this.feedback.set(undefined);
          },
          error: (error: CustomError) => 
          {
            this.teamSubmitted.set(false);
            this.feedback.set(error.message);
          }
        }
      )
  }
}
