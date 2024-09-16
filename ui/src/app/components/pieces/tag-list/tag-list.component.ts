import { Component, Input } from '@angular/core';
import { Tag } from 'src/app/models/tag.model';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.scss'
})
export class TagListComponent 
{
  @Input() tags?: Tag[] = [];
  @Input() removable?: boolean = false;

  remove(index: number)
  {
    if(this.removable)
    {
      this.tags?.splice(index, 1);
    }
  }
}
