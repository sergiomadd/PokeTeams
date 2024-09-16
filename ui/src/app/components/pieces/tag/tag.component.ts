import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from 'src/app/models/tag.model';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent 
{
  @Input() tag!: Tag;
  @Input() removable: boolean = false;
  @Output() removeEvent = new EventEmitter<Tag>()

  remove()
  {
    this.removeEvent.emit(this.tag);
  }
}
