import { Component, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { I18nService } from '../../../../core/helpers/i18n.service';
import { ThemeService } from '../../../../core/helpers/theme.service';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { Chip } from '../../../../core/models/misc/chip.model';
import { QueryItem } from '../../../../core/models/misc/queryResult.model';
import { SetOperation } from '../../../../core/models/search/setOperation.enum';
import { QueryService } from '../../../../core/services/query.service';
import { TeamService } from '../../../../core/services/team.service';
import { selectTheme } from '../../../../core/store/config/config.selectors';
import { GetTagBgColorPipe } from '../../../pipes/color-pipes/getTagBgColor.pipe';
import { GetTagTextColorPipe } from '../../../pipes/color-pipes/getTagTextColor.pipe';
import { SearchService } from '../../../services/search.service';
import { NgClass, NgTemplateOutlet, NgStyle } from '@angular/common';
import { SmartInputComponent } from '../../smart-input/smart-input.component';
import { RadioComponent } from '../../dumb/radio/radio.component';
import { TooltipComponent } from '../../dumb/tooltip/tooltip.component';
import { ChipComponent } from '../../dumb/chip/chip.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-team-search',
    templateUrl: './team-search.component.html',
    styleUrl: './team-search.component.scss',
    providers: [GetTagBgColorPipe, GetTagTextColorPipe],
    imports: [NgClass, SmartInputComponent, NgTemplateOutlet, NgStyle, RadioComponent, TooltipComponent, ChipComponent, TranslatePipe]
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
  i18n = inject(I18nService);

  getTagBgColor = inject(GetTagBgColorPipe);
  getTagTextColor = inject(GetTagTextColorPipe);

  readonly userSearch = input<boolean>(false);

  chips: Chip[] = [];
  unionType: SetOperation = SetOperation.intersection;
  unionTypeSettings: SetOperation[] = [SetOperation.intersection, SetOperation.union];
  feedback?: string;

  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  selectedThemeName?: string;

  ngOnInit()
  {
    this.searchService.searchError.subscribe((value) => 
    {
      this.feedback = value;
    })
  }

  search()
  {
    this.searchService.setQuerySelectedPage(1);
    this.searchService.defaultSearch();
  }

  async queryResultSelectEvent(event?: QueryItem)
  {
    this.feedback = undefined;
    if(!event) { return; }
    if(event.type === "user")
    {
      this.feedback = this.validatePlayer(event.name);
      if(this.feedback) { return; }
    }
    if(event.type === "tournament")
    {
      this.feedback = this.validateTournament(event.name);
      if(this.feedback) { return; }
    }
    if(!this.chips.find(t => t.identifier === event.identifier)) 
    {
      if(event.type === "tag")
      {
        const chip: Chip = 
        {
          name: event.name,
          identifier: event.identifier,
          color: event.icon ? this.getTagBgColor.transform(event.icon) : undefined,
          textColor: event.icon ? this.getTagTextColor.transform(event.icon) : undefined,
          type: event.type
        }
        this.chips?.push(chip);
      }
      else
      {
        const chip: Chip = 
        {
          name: event.name,
          identifier: event.identifier,
          iconPath: event.icon,
          type: event.type
        }
        this.chips?.push(chip);
        this.sortChips();
      }
      this.searchService.setQueryItems(this.chips);
    }
    else { this.feedback =  this.i18n.translateKey('search.team_search.duplicate-feedback')}
  }

  chipRemoveEvent($event)
  {
    this.chips.splice($event, 1);
    this.searchService.setQueryItems(this.chips);
  }

  querySettingsSelectEvent($event)
  {
    this.unionType = $event;
    this.searchService.setQuerySetOperation(this.unionType);
  }

  reset()
  {
    this.chips = [];
    this.searchService.setQueryItems([]);
    this.searchService.defaultSearch();
  }

  validatePlayer(player: string): string | undefined
  {
    if(player.length <= 0)
    {
      return "";
    }
    if(player.length > 32)
    {
      return this.i18n.translateKeyWithParameters('team.editor.errors.player', { maxlength: 32 });
    }
    return undefined;
  }

  validateTournament(tournament: string): string | undefined
  {
    if(tournament.length > 256)
    {
      return this.i18n.translateKeyWithParameters('team.editor.errors.tournament', { maxlength: 256 });
    }
    return undefined;
  }

  sortChips()
  {
    const customOrder: string[] = ["user", "tournament", "regulation", "tag", "pokemon", "move", "item"];

    this.chips.sort((a, b) => 
    {
      const indexA = customOrder.indexOf(a.type ?? 'z');
      const indexB = customOrder.indexOf(b.type ?? 'z');
      return indexA - indexB;
    });
  }
}
