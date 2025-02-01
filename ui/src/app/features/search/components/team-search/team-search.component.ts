import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectTheme } from 'src/app/core/config/store/config.selectors';
import { WindowService } from 'src/app/core/layout/mobile/window.service';
import { QueryResult } from 'src/app/shared/models/queryResult.model';
import { UtilService } from 'src/app/shared/services/util.service';
import { QueryService } from '../../../../shared/services/query.service';
import { SetOperation } from '../../models/setOperation.enum';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-team-search',
  templateUrl: './team-search.component.html',
  styleUrl: './team-search.component.scss'
})
export class TeamSearchComponent 
{
  queryService = inject(QueryService);
  util = inject(UtilService);
  store = inject(Store)
  searchService = inject(SearchService);
  window = inject(WindowService);

  queryResults: QueryResult[] = [];
  unionType: SetOperation = SetOperation.intersection;
  unionTypeSettings: SetOperation[] = [SetOperation.intersection, SetOperation.union];

  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  selectedThemeName?: string;

  search()
  {
    this.searchService.setQuerySelectedPage(1);
    this.searchService.defaultSearch();
  }

  queryResultSelectEvent($event: QueryResult)
  {
    if(!this.queryResults.find(t => t.identifier === $event.identifier)) 
    {
      this.queryResults?.push($event);
      this.searchService.setQueryItems(this.queryResults);
    }
    else { console.log("Tag already added") }
  }

  queryResultRemoveEvent()
  {
    this.searchService.setQueryItems(this.queryResults);
  }

  querySettingsSelectEvent($event)
  {
    this.unionType = $event;
  }

  reset()
  {
    this.queryResults = [];
    this.searchService.setQueryItems([]);
    this.searchService.defaultSearch();
  }
}
