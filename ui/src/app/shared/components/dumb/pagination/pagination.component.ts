import { Component, input, model, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss',
    imports: [NgClass]
})
export class PaginationComponent 
{
  currentPage = model<number>(1);
  readonly itemsPerPage = input.required<number>();
  readonly totalItems = input.required<number>();
  readonly pageChanged = output<number>();

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