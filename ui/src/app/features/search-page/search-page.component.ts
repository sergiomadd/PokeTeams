import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, skip } from 'rxjs';
import { SeoService } from '../../core/helpers/seo.service';
import { selectLoggedUser } from '../../core/store/auth/auth.selectors';
import { selectLang } from '../../core/store/config/config.selectors';
import { TeamSearchComponent } from '../../shared/components/team/team-search/team-search.component';
import { TeamTableComponent } from '../../shared/components/team/team-table/team-table.component';
import { SearchService } from '../../shared/services/search.service';
import { User } from '../user/models/user.model';

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrl: './search-page.component.scss',
    imports: [TeamSearchComponent, TeamTableComponent]
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
