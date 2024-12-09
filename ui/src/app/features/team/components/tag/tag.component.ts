import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ThemeService } from 'src/app/core/config/services/theme.service';
import { Tag } from 'src/app/features/team/models/tag.model';

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
