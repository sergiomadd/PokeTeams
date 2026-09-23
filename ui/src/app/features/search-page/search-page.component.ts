import { Component, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SeoService } from '../../core/helpers/seo.service';
import { selectLoggedUser } from '../../core/store/auth/auth.selectors';
import { selectLang } from '../../core/store/config/config.selectors';
import { TeamSearchComponent } from '../../shared/components/team/team-search/team-search.component';
import { TeamTableComponent } from '../../shared/components/team/team-table/team-table.component';
import { SearchService } from '../../shared/services/search.service';

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

  loggedUser = this.store.selectSignal(selectLoggedUser)
  selectedLang = this.store.selectSignal(selectLang)

  firstRun = false;

  constructor()
  {
    this.seo.updateMetaData({
      title: `Search`,
      description: 'Display the pokemon team information in a visually engaging ui. With the option to copy the pokepaste of the team.',
      slug: "search",
    });
    this.searchService.resetDefaultSearch();
    effect(() => 
    {
      this.loggedUser();
      this.selectedLang();
      if(!this.firstRun) { this.firstRun = true; }
      this.searchService.resetDefaultSearch();
    })
  }

  ngOnDestroy()
  {
    this.searchService.resetTeams();
  }
}
