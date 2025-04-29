import { Component, inject, Input } from '@angular/core';
import { UtilService } from 'src/app/core/helpers/util.service';
import { Regulation } from 'src/app/core/models/team/regulation.model';

@Component({
  selector: 'app-regulation-preview',
  templateUrl: './regulation-preview.component.html'
})
export class RegulationPreviewComponent 
{
  util = inject(UtilService);

  @Input() regulation?: Regulation | null;

  loading: boolean = false;
}
