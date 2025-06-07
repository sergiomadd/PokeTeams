import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-translation',
  templateUrl: './no-translation.component.html',
  styleUrl: './no-translation.component.scss'
})
export class NoTranslationComponent 
{
  @Input() noTooltip?: boolean = false;
}
