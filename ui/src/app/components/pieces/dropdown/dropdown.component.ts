import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent 
{
  @Input() options?: any[];
  @Input() selectedOption?: any;
  @Input() disable?: boolean;
  
  @Output() selectEvent = new EventEmitter<object>();

  showOptions?: boolean = false;

  onClick()
  {
    this.showOptions = !this.showOptions;
  }

  onSelect(option)
  {
    this.selectEvent.emit(option);
    this.onClick();
  }
}
