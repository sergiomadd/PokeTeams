import { Component, inject, Input } from '@angular/core';
import { WindowService } from 'src/app/core/helpers/window.service';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss',
    standalone: false
})
export class NotFoundComponent 
{
  window = inject(WindowService);

  @Input() resourceName?: string;
}
