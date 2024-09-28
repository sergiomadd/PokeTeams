import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from 'src/app/models/tag.model';

@Component({
  selector: 'app-regulation-selector',
  templateUrl: './regulation-selector.component.html',
  styleUrl: './regulation-selector.component.scss'
})
export class RegulationSelectorComponent 
{
  @Input() allGetter?: (args?: any) => Promise<Tag[]>

  @Input() sideItemsAmount: number = 1;
  @Input() showArrows: boolean = false;

  @Output() selectEvent = new EventEmitter<Tag>();

  items: Tag[] = [];
  currentIndex: number = 0;

  async ngAfterContentInit()
  {
    if(this.allGetter)
    {
      this.items = await this.allGetter();
    }
  }

  prev()
  {
    if(this.currentIndex > 0) { this.currentIndex--; }
    this.select();
  }

  next()
  {
    if(this.currentIndex < this.items.length) { this.currentIndex++; }
    this.select();
  }

  select()
  {
    this.selectEvent.emit(this.items[this.currentIndex]);
  }
}
