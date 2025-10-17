import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-tooltip',
    templateUrl: './tooltip.component.html',
    styleUrl: './tooltip.component.scss',
    standalone: false
})
export class TooltipComponent 
{
  @Input() text?: string;
  @Input() side: string = "left";
  @Input() visible?: boolean = false;
  @Input() instant?: boolean = false;
  @Input() loading?: boolean = false;
  @Input() loadingText?: string;
}
