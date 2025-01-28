import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectTheme } from 'src/app/core/config/store/config.selectors';
import { WindowService } from 'src/app/core/layout/mobile/window.service';
import { Tag } from 'src/app/features/team/models/tag.model';
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

  tags: Tag[] = [];
  unionType: SetOperation = SetOperation.intersection;
  unionTypeSettings: SetOperation[] = [SetOperation.intersection, SetOperation.union];

  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  selectedThemeName?: string;

  search()
  {
    this.searchService.setQuerySelectedPage(1);
    this.searchService.defaultSearch();
  }

  tagSelectEvent($event: Tag)
  {
    if(!this.tags.find(t => t.identifier === $event.identifier)) 
    {
      this.tags?.push($event);
      this.searchService.setQueryTags(this.tags);
    }
    else { console.log("Tag already added") }
  }

  tagRemoveEvent($event: Tag)
  {
    this.searchService.setQueryTags(this.tags);
  }

  tagsSettingsSelectEvent($event)
  {
    this.unionType = $event;
  }

  reset()
  {
    this.tags = [];
    this.searchService.setQueryTags([]);
    this.searchService.defaultSearch();
  }
}
