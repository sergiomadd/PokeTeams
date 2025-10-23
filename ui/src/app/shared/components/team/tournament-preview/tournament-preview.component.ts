import { Component, inject, input } from '@angular/core';
import { UtilService } from '../../../../core/helpers/util.service';
import { Tournament } from '../../../../core/models/team/tournament.model';

@Component({
    selector: 'app-tournament-preview',
    templateUrl: './tournament-preview.component.html',
    standalone: false
})
export class TournamentPreviewComponent 
{
  util = inject(UtilService);

  readonly tournament = input<Tournament | null>();

  loading: boolean = false;


}
