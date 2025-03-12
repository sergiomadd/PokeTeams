import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chip } from 'src/app/core/models/misc/chip.model';


@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent 
{
  @Input() options?: Chip[];
  @Input() selectedOption?: Chip;
  @Input() onlyIcon?: boolean;
  @Input() disable?: boolean;
  
  @Output() selectEvent = new EventEmitter<Chip>();

  showOptions?: boolean = false;

  toggleOptions()
  {
    this.showOptions = !this.showOptions;
  }

  onSelect(option)
  {
    this.selectEvent.emit(option);
    this.toggleOptions();
  }
}