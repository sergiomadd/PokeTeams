import { Component, Input } from '@angular/core';
import { Tag } from 'src/app/models/tag.model';

@Component({
  selector: 'app-result-storage',
  templateUrl: './result-storage.component.html',
  styleUrl: './result-storage.component.scss'
})
export class ResultStorageComponent 
{
  @Input() results?: Tag[] = [];

  remove(index: number)
  {
    this.results?.splice(index, 1);
  }
}
