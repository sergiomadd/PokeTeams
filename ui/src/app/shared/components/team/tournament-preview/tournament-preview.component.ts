import { Component, inject, Input } from '@angular/core';
import { UtilService } from 'src/app/core/helpers/util.service';
import { Tournament } from 'src/app/core/models/team/tournament.model';

@Component({
  selector: 'app-tournament-preview',
  templateUrl: './tournament-preview.component.html',
  styleUrl: './tournament-preview.component.scss'
})
export class TournamentPreviewComponent 
{
  util = inject(UtilService);

  @Input() tournament?: Tournament | null;

  loading: boolean = false;


}
