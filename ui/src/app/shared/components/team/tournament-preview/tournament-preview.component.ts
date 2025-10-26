import { Component, inject, input } from '@angular/core';
import { UtilService } from '../../../../core/helpers/util.service';
import { Tournament } from '../../../../core/models/team/tournament.model';
import { GetFlagIconUrlPipe } from '../../../pipes/getFlagIconUrl.pipe';
import { CustomFormatDatePipe } from '../../../pipes/converters/customFormatDate.pipe';

@Component({
    selector: 'app-tournament-preview',
    templateUrl: './tournament-preview.component.html',
    imports: [GetFlagIconUrlPipe, CustomFormatDatePipe]
})
export class TournamentPreviewComponent 
{
  util = inject(UtilService);

  readonly tournament = input<Tournament | null>();

  loading: boolean = false;


}
