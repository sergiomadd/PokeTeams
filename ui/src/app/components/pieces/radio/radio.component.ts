import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss'
})
export class RadioComponent 
{
  @Input() obj?: any;
  @Input() objSelector?: string;
  @Input() options: string[] = [];
  @Input() optionNames: string[] = [];
  @Input() selected?: number;
  @Output() checkEvent = new EventEmitter<number>();

  clickEvent($event: number)
  {
    this.selected = $event;
    if(this.objSelector && this.options)
    {
      this.obj[this.objSelector] = this.options[this.selected];
    }
    this.checkEvent.emit(this.selected);
  }
}
