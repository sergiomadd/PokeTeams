import { Component, EventEmitter, Output, TemplateRef, input, model } from '@angular/core';

@Component({
    selector: 'app-radio',
    templateUrl: './radio.component.html',
    styleUrl: './radio.component.scss',
    standalone: false
})
export class RadioComponent 
{
  readonly options = input<any[]>([]);
  readonly optionNames = input<string[]>([]);
  readonly optionIcons = input<string[]>([]);
  readonly optionSVGs = input<TemplateRef<any>[]>([]);
  readonly tooltipTexts = input<string[] | undefined>([]);
  readonly selectedIndex = model<number>();
  @Output() selectEvent = new EventEmitter<number>();

  select($event: number)
  {
    this.selectedIndex.set($event);
    this.selectEvent.emit(this.options()[this.selectedIndex() ?? 0]);
  }
}
