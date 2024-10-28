import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss'
})
export class RadioComponent 
{
  @Input() options: any[] = [];
  @Input() optionNames: string[] = [];
  @Input() selectedIndex?: number;
  @Output() selectEvent = new EventEmitter<number>();

  select($event: number)
  {
    this.selectedIndex = $event;
    this.selectEvent.emit(this.options[this.selectedIndex]);
  }
}
