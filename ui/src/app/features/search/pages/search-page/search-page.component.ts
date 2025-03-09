import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectLang } from 'src/app/core/config/store/config.selectors';
import { SearchService } from '../../services/search.service';

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
    this.selectedLang$.subscribe(value =>
      {
        this.searchService.resetDefaultSearch();
      });
  }
}
