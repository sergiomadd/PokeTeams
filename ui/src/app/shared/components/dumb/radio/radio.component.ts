import { Component, TemplateRef, input, model, output } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
    selector: 'app-radio',
    templateUrl: './radio.component.html',
    styleUrl: './radio.component.scss',
    imports: [NgClass, NgTemplateOutlet, TooltipComponent]
})
export class RadioComponent 
{
  readonly options = input<any[]>([]);
  readonly optionNames = input<string[]>([]);
  readonly optionIcons = input<string[]>([]);
  readonly optionSVGs = input<TemplateRef<any>[]>([]);
  readonly tooltipTexts = input<string[] | undefined>([]);
  readonly selectedIndex = model<number>();
  readonly selectEvent = output<number>();

  select($event: number)
  {
    this.selectedIndex.set($event);
    this.selectEvent.emit(this.options()[this.selectedIndex() ?? 0]);
  }
}
