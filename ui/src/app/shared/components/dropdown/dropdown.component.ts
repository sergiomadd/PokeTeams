import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from 'src/app/features/team/models/tag.model';


@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent 
{
  @Input() options?: Tag[];
  @Input() selectedOption?: Tag;
  @Input() onlyIcon?: boolean;
  @Input() disable?: boolean;
  
  @Output() selectEvent = new EventEmitter<Tag>();

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