import { Component, inject, Input } from '@angular/core';
import { WindowService } from 'src/app/core/layout/mobile/window.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent 
{
  window = inject(WindowService);

  @Input() resourceName?: string;
}
