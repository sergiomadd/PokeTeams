import { Component, EventEmitter, Output, input, model } from '@angular/core';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss',
    standalone: false
})
export class PaginationComponent 
{
  currentPage = model<number>(1);
  readonly itemsPerPage = input.required<number>();
  readonly totalItems = input.required<number>();
  @Output() pageChanged: EventEmitter<number> = new EventEmitter();

  get totalPages(): number
  {
    return Math.ceil(this.totalItems() / this.itemsPerPage());
  }

  changePage(page: number): void 
  {
    if (page >= 1 && page <= this.totalPages) 
    {
      this.currentPage.set(page);
      this.pageChanged.emit(page);
    }
  }
}