import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent 
{
  @Input() currentPage: number = 1;
  @Input() itemsPerPage!: number;
  @Input() totalItems!: number;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges)
  {
  }
  
  get totalPages(): number
  {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number): void 
  {
    if (page >= 1 && page <= this.totalPages) 
    {
      this.currentPage = page;
      this.pageChanged.emit(page);
    }
  }
}
