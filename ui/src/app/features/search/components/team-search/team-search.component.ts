import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ThemeService } from 'src/app/core/config/services/theme.service';
import { selectTheme } from 'src/app/core/config/store/config.selectors';
import { WindowService } from 'src/app/core/layout/mobile/window.service';
import { Tag } from 'src/app/features/team/models/tag.model';
import { TeamService } from 'src/app/features/team/services/team.service';
import { Chip } from 'src/app/shared/models/chip.model';
import { QueryItem } from 'src/app/shared/models/queryResult.model';
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
  teamService = inject(TeamService);
  theme = inject(ThemeService);

  chips: Chip[] = [];
  unionType: SetOperation = SetOperation.intersection;
  unionTypeSettings: SetOperation[] = [SetOperation.intersection, SetOperation.union];

  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  selectedThemeName?: string;

  search()
  {
    this.searchService.setQuerySelectedPage(1);
    this.searchService.defaultSearch();
  }

  async queryResultSelectEvent($event: QueryItem)
  {
    if(!this.chips.find(t => t.identifier === $event.identifier)) 
    {
      if($event.type === "tag")
      {
        const tag: Tag = $event as Tag;
        const chip: Chip = 
        {
          name: tag.name,
          identifier: tag.identifier,
          iconPath: tag.icon,
          tooltipText: tag.description,
          color: tag.color,
          textColor: tag.color ? this.theme.getTagTextColor(tag.color) : undefined,
          type: tag.type
        }
        this.chips?.push(chip);
      }
      else
      {
        const chip: Chip = 
        {
          name: $event.name,
          identifier: $event.identifier,
          iconPath: $event.icon,
          type: $event.type
        }
        this.chips?.push(chip);
      }
      this.searchService.setQueryItems(this.chips);
    }
    else { console.log("Chip already added") }
  }

  chipRemoveEvent($event)
  {
    this.chips.splice($event, 1);
    this.searchService.setQueryItems(this.chips);
  }

  querySettingsSelectEvent($event)
  {
    this.unionType = $event;
  }

  reset()
  {
    this.chips = [];
    this.searchService.setQueryItems([]);
    this.searchService.defaultSearch();
  }
}
