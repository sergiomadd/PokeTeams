import { Component, input, output } from '@angular/core';
import { Chip } from '../../../../core/models/misc/chip.model';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    imports: [NgClass, TranslatePipe]
})
export class DropdownComponent 
{
  readonly options = input<Chip[]>();
  readonly selectedOption = input<Chip>();
  readonly onlyIcon = input<boolean>();
  readonly disable = input<boolean>();
  
  readonly selectEvent = output<Chip>();

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