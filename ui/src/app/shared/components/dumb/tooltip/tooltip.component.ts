import { Component, input } from '@angular/core';

@Component({
    selector: 'app-tooltip',
    templateUrl: './tooltip.component.html',
    styleUrl: './tooltip.component.scss',
    standalone: false
})
export class TooltipComponent 
{
  readonly text = input<string | undefined>('');
  readonly side = input<string>("left");
  readonly visible = input<boolean | undefined>(false);
  readonly instant = input<boolean | undefined>(false);
  readonly loading = input<boolean | undefined>(false);
  readonly loadingText = input<string>();
}
