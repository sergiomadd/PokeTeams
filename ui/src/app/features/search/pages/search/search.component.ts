import { Component, inject, SimpleChanges } from '@angular/core';
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

  searched: boolean = false;
  unionType: SetOperation = SetOperation.intersection;
  unionTypeSettings: SetOperation[] = [SetOperation.intersection, SetOperation.union];

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['teams'])
    {
      this.searched = false;
    }
  }

  async ngOnInit()
  {
    this.searchService.searched.subscribe((value: boolean) =>
      {
        this.searched = value;
      }
    );
    this.searchService.defaultSearch();
  }

  async ngAfterContentInit()
  {
  }

  querySelectEvent($event: Tag)
  {
    if(!this.tags.find(t => t.identifier === $event.identifier)) { this.tags?.push($event); }
    else { console.log("Tag already added") }
  }

  tagRemoveEvent($event: Tag)
  {

  }

  tagsSettingsSelectEvent($event)
  {
    this.unionType = $event;
  }

  reset()
  {
    this.tags = [];
  }
}
