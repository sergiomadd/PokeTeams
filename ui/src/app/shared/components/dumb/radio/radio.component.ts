import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-radio',
    templateUrl: './radio.component.html',
    styleUrl: './radio.component.scss',
    standalone: false
})
export class RadioComponent 
{
  @Input() options: any[] = [];
  @Input() optionNames: string[] = [];
  @Input() optionIcons: string[] = [];
  @Input() optionSVGs: TemplateRef<any>[] = [];
  @Input() tooltipTexts?: string[] = [];
  @Input() selectedIndex?: number;
  @Output() selectEvent = new EventEmitter<number>();

  select($event: number)
  {
    this.selectedIndex = $event;
    this.selectEvent.emit(this.options[this.selectedIndex]);
  }
}
