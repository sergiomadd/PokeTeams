import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, skip } from 'rxjs';
import { SeoService } from 'src/app/core/helpers/seo.service';
import { selectLoggedUser } from 'src/app/core/store/auth/auth.selectors';
import { selectLang } from 'src/app/core/store/config/config.selectors';
import { SearchService } from '../../../shared/services/search.service';
import { User } from '../../user/models/user.model';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent 
{
  searchService = inject(SearchService);
  store = inject(Store);
  seo = inject(SeoService);

  loggedUser$: Observable<User | null> = this.store.select(selectLoggedUser);
  selectedLang$: Observable<string> = this.store.select(selectLang);

  ngOnInit()
  {
    this.seo.updateMetaData({
      title: `Search`,
      description: 'Display the pokemon team information in a visually engaging ui. With the option to copy the pokepaste of the team.',
      slug: "search",
    });

    this.searchService.resetDefaultSearch();
    this.loggedUser$.pipe(skip(1)).subscribe(value =>
      {
        this.searchService.resetDefaultSearch();
      });
    this.selectedLang$.pipe(skip(1)).subscribe(value =>
      {
        this.searchService.resetDefaultSearch();
      });
  }

  ngOnDestroy()
  {
    this.searchService.resetTeams();
  }
}
