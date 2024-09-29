import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Tag } from 'src/app/models/tag.model';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent 
{
  themeService = inject(ThemeService);

  @Input() tag!: Tag;
  @Input() removable: boolean = false;
  @Output() removeEvent = new EventEmitter<Tag>()

  remove()
  {
    this.removeEvent.emit(this.tag);
  }
}
