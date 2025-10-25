import { Component, input } from '@angular/core';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-no-translation',
    templateUrl: './no-translation.component.html',
    styleUrl: './no-translation.component.scss',
    imports: [TooltipComponent, TranslatePipe]
})
export class NoTranslationComponent 
{
  readonly noTooltip = input<boolean | undefined>(false);
}
