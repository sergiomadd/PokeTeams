import { Component, inject, Input } from '@angular/core';
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

  @Input() tournament?: Tournament | null;

  loading: boolean = false;


}
