import { Component, Input } from '@angular/core';
import { Tag } from 'src/app/models/tag.model';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent 
{
  @Input() tag?: Tag;

  showDescription: boolean = false;

  toggleDescription()
  {
    this.showDescription = !this.showDescription;
  }

}
