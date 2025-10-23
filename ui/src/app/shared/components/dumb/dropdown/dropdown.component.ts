import { Component, EventEmitter, Output, input } from '@angular/core';
import { Chip } from '../../../../core/models/misc/chip.model';

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    standalone: false
})
export class DropdownComponent 
{
  readonly options = input<Chip[]>();
  readonly selectedOption = input<Chip>();
  readonly onlyIcon = input<boolean>();
  readonly disable = input<boolean>();
  
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