import { Component, inject, input } from '@angular/core';
import { UtilService } from '../../../../core/helpers/util.service';
import { Regulation } from '../../../../core/models/team/regulation.model';

@Component({
    selector: 'app-regulation-preview',
    templateUrl: './regulation-preview.component.html',
    standalone: false
})
export class RegulationPreviewComponent 
{
  util = inject(UtilService);

  readonly regulation = input<Regulation | null>();

  loading: boolean = false;
}
