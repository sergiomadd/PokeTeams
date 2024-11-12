import { Component, inject } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent 
{
  searchService = inject(SearchService);

  ngOnInit()
  {
    this.searchService.defaultSearch();
  }
}
