import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent 
{
  @Input() options?: DropdownOption[];
  @Input() selectedOption?: DropdownOption;
  @Input() disable?: boolean;
  
  @Output() selectEvent = new EventEmitter<DropdownOption>();

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

export interface DropdownOption
{
  name: string,
  path?: string
}
