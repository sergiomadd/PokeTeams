import { NgClass, NgStyle } from '@angular/common';
import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { I18nService } from '../../../../core/helpers/i18n.service';
import { UtilService } from '../../../../core/helpers/util.service';
import { WindowService } from '../../../../core/helpers/window.service';
import { SortOrder, SortType, SortWay } from '../../../../core/models/search/sortOrder.model';
import { TeamPreviewToCompare } from '../../../../core/models/team/teamPreviewToCompare.model';
import { selectLoggedUser } from '../../../../core/store/auth/auth.selectors';
import { configActions } from '../../../../core/store/config/config.actions';
import { selectTeamsPerPage, selectTheme } from '../../../../core/store/config/config.selectors';
import { SearchService } from '../../../services/search.service';
import { TeamCompareService } from '../../../services/team-compare.service';
import { PaginationComponent } from '../../dumb/pagination/pagination.component';
import { PokemonIconsComponent } from '../../pokemon/pokemon-icons/pokemon-icons.component';
import { TeamPreviewComponent } from '../team-preview/team-preview.component';

@Component({
    selector: 'app-team-table',
    templateUrl: './team-table.component.html',
    styleUrl: './team-table.component.scss',
    imports: [NgClass, TeamPreviewComponent, PaginationComponent, FormsModule, ReactiveFormsModule, NgStyle, PokemonIconsComponent, TranslatePipe]
})
export class TeamTableComponent 
{
  formBuilder = inject(FormBuilder);
  util = inject(UtilService);
  searchService = inject(SearchService);
  store = inject(Store);
  window = inject(WindowService);
  compareService = inject(TeamCompareService);
  router = inject(Router);
  i18n = inject(I18nService);

  teams = this.searchService.teams;
  searched = this.searchService.searched;
  loggedUser = this.store.selectSignal(selectLoggedUser);

  sortTypeIds: string[] = ["date", "views"];
  sortOrder: SortOrder = 
  {
    type: SortType.date,
    way: SortWay.descending
  };
  //pagination
  totalTeams = this.searchService.totalTeams;
  readonly defaultTeams: number = 10;
  paginationForm = this.formBuilder.group(
    {
      teamsPerPage: [this.defaultTeams, [Validators.min(1), Validators.max(50)]]
    }, { updateOn: "blur" });
  paginationComponent = viewChild.required(PaginationComponent);
  formTeamsPerPage = toSignal(this.paginationForm.controls.teamsPerPage.valueChanges);

  selectedTheme = this.store.selectSignal(selectTheme);

  teamsToCompare = this.compareService.teamsToCompare;
  teamsToCompareFeedback = signal<string | undefined>(undefined);
  teamsToCompareOpen = signal<boolean>(false);

  firstLoad = true;
  teamsPerPage = this.store.selectSignal(selectTeamsPerPage);

  constructor()
  {
    effect(() => 
    {
      if(this.searched() && this.paginationComponent())
      {
        this.paginationComponent().currentPage.set(this.searchService.getCurrentPage());
      }
    })

    effect(() => 
    {
      const teamsPerPage = this.formTeamsPerPage();
      if(teamsPerPage)
      {
        if(this.util.isNaN(teamsPerPage))
        {
          this.paginationForm.controls.teamsPerPage.setErrors({ "nan": true });
        }
        if(this.paginationForm.controls.teamsPerPage.valid)
        {
          this.store.dispatch(configActions.changeTeamsPerPage({request: teamsPerPage}))
        }
      }
      else
      {
        this.paginationForm.controls.teamsPerPage.setValue(this.defaultTeams);
        this.store.dispatch(configActions.changeTeamsPerPage({request: this.defaultTeams}))
      }
    })

    effect(() => 
    {
      this.teamsToCompare();
      this.teamsToCompareFeedback.set(undefined);
    })

    effect(() => 
    {
      const teamsPerPage = this.teamsPerPage();
      //Only search when value changes after first load
      if(this.firstLoad) { this.firstLoad = false; return; }
      this.searchService.setQueryTeamsPerPage(teamsPerPage); // Set query on every change
      this.searchService.defaultSearch(); // Perform default search on value change

    })
  }

  deleteTeam()
  {
    this.searchService.defaultSearch();
  }

  //sorting
  changeSorter(index)
  {
    //netural -> descending
    if(this.sortOrder.type != SortType[SortType[index]])
    {
      this.sortOrder.type = SortType[SortType[index]];
      this.sortOrder.way = SortWay.descending;
    }
    //descending -> ascending
    else if(this.sortOrder.type === SortType[SortType[index]] && this.sortOrder.way === SortWay.descending)
    {
      this.sortOrder.way = SortWay.ascending;
    }
    //ascending -> neutral (reset)
    else if(this.sortOrder.type === SortType[SortType[index]] && this.sortOrder.way === SortWay.ascending)
    {
      this.sortOrder.type = undefined;
    }
    this.searchService.setQuerySortOrder(this.sortOrder);
    this.searchService.defaultSearch();
  }

  pageChange($event, container)
  {
    if(this.searchService.getCurrentPage() != $event)
    {
      container.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      this.searchService.setQuerySelectedPage($event);
      this.searchService.pageChangeSearch();
    }
  }

  isInvalid(key: string) : boolean
  {
    var control = this.paginationForm.get(key);
    let invalid = (control?.errors
      && (control?.dirty || control?.touched))
      ?? false;
    return invalid;
  }

  getError(key: string) : string
  {
    let control: AbstractControl | null =  this.paginationForm.get(key);
    return this.util.getAuthFormError(control);
  }

  compare()
  {
    if(this.teamsToCompare().length === 2)
    {
      const queryParams =
      {
        teamAId: this.teamsToCompare()[0].teamData.id,
        teamBId: this.teamsToCompare()[1].teamData.id
      };
      
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/compare'], { queryParams })
      );
      
      window.open(url, '_blank');
    }
    else
    {
      this.teamsToCompareFeedback.set(this.i18n.translateKey('team.compare.to_compare_only_one'));
    }
  }

  removeTeamToCompare(index: number)
  {
    const teamToRemove: TeamPreviewToCompare | undefined = this.teamsToCompare()[index];
    if(teamToRemove)
    {
      this.compareService.removeTeamsToCompare(teamToRemove.teamData.id);
    }
  }

  toggleTeamsToCompare()
  {
    this.teamsToCompareOpen.update(value => !value);
  }

  swapTeamsToCompare()
  {
    let teamsToCompare = this.teamsToCompare();
    if (teamsToCompare && teamsToCompare.length === 2)
    {
      const swappedTeamsToCompare = [teamsToCompare[1], teamsToCompare[0]];
      this.compareService.teamsToCompare.set(swappedTeamsToCompare);
    }
  }
}
