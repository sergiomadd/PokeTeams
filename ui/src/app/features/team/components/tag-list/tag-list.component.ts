import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from 'src/app/features/team/models/tag.model';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.scss'
})
export class TagListComponent 
{
  @Input() tags: Tag[] = [];
  @Input() removable?: boolean = false;
  @Output() removeEvent = new EventEmitter<Tag>()

  remove(index: number)
  {
    if(this.removable)
    {
      this.removeEvent.emit(this.tags[index]);
      this.tags.splice(index, 1);
    }
  }
}
