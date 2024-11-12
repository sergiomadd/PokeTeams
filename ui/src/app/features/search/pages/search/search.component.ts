import { Component, inject } from '@angular/core';
import { ThemeService } from 'src/app/core/services/theme.service';
import { QueryService } from 'src/app/features/search/services/query.service';
import { Tag } from 'src/app/features/team/models/tag.model';
import { UtilService } from 'src/app/shared/services/util.service';
import { SetOperation } from '../../models/setOperation.enum';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent 
{
  queryService = inject(QueryService);
  util = inject(UtilService);
  theme = inject(ThemeService)
  searchService = inject(SearchService);

  tags: Tag[] = [];
  unionType: SetOperation = SetOperation.intersection;
  unionTypeSettings: SetOperation[] = [SetOperation.intersection, SetOperation.union];

  async ngOnInit()
  {
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
  }
}
