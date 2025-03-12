import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, skip } from 'rxjs';
import { selectLang } from 'src/app/core/store/config/config.selectors';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent 
{
  searchService = inject(SearchService);
  store = inject(Store);

  selectedLang$: Observable<string> = this.store.select(selectLang);

  ngOnInit()
  {
    this.selectedLang$.pipe(skip(1)).subscribe(value =>
      {
        this.searchService.resetDefaultSearch();
      });
  }
}
