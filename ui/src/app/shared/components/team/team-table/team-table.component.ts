import { Component, inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, skip, take } from 'rxjs';
import { UtilService } from 'src/app/core/helpers/util.service';
import { WindowService } from 'src/app/core/helpers/window.service';
import { SortOrder, SortType, SortWay } from 'src/app/core/models/search/sortOrder.model';
import { TeamPreviewData } from 'src/app/core/models/team/teamPreviewData.model';
import { selectLoggedUser } from 'src/app/core/store/auth/auth.selectors';
import { configActions } from 'src/app/core/store/config/config.actions';
import { selectTeamsPerPage, selectTheme } from 'src/app/core/store/config/config.selectors';
import { User } from 'src/app/features/user/models/user.model';
import { PaginationComponent } from 'src/app/shared/components/dumb/pagination/pagination.component';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-team-table',
  templateUrl: './team-table.component.html',
  styleUrl: './team-table.component.scss'
})
export class TeamTableComponent 
{
  formBuilder = inject(FormBuilder);
  util = inject(UtilService);
  searchService = inject(SearchService);
  store = inject(Store);
  window = inject(WindowService);

  teams: TeamPreviewData[] = [];
  searched: boolean = false;
  loggedUser$ = this.store.select(selectLoggedUser);
  logged?: User;

  sortTypeIds: string[] = ["date", "views"];
  sortOrder: SortOrder = 
  {
    type: SortType.date,
    way: SortWay.descending
  };
  //pagination
  totalTeams?: number;
  paginationForm = this.formBuilder.group(
    {
      teamsPerPage: [10, [Validators.min(1), Validators.max(100)]]
    }, { updateOn: "blur" });
  @ViewChild(PaginationComponent) paginationComponent!: PaginationComponent;

  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  selectedThemeName?: string;

  async ngOnInit()
  {
    this.searchService.teams.subscribe((value: TeamPreviewData[]) =>
      {
        this.teams = value;
      }
    );
    this.searchService.totalTeams.subscribe((value: number) =>
      {
        this.totalTeams = value;
      }
    );

    this.searchService.searched.subscribe((value: boolean) =>
      {
        this.searched = value;
        if(this.searched && this.paginationComponent)
        {
          this.paginationComponent.currentPage = this.searchService.getCurrentPage();
        }
      }
    );

    this.paginationForm.controls.teamsPerPage.valueChanges.subscribe(value =>
      {
        if(value)
        {
          if(this.util.isNaN(value))
          {
            this.paginationForm.controls.teamsPerPage.setErrors({ "nan": true });
          }
          if(this.paginationForm.controls.teamsPerPage.valid)
          {
            this.store.dispatch(configActions.changeTeamsPerPage({request: value}))
          }
        }
        else
        {
          this.paginationForm.controls.teamsPerPage.setValue(10);
          this.store.dispatch(configActions.changeTeamsPerPage({request: 10}))
        }
      }
    )
    this.loggedUser$.subscribe(value =>
    {
      this.logged = value ?? undefined;
    })
    
    //Only search when value changes after first load
    this.store.select(selectTeamsPerPage).pipe(skip(1)).subscribe(value => 
    {
      this.searchService.setQueryTeamsPerPage(value); // Set query on every change
      this.searchService.defaultSearch(); // Perform default search on value change
    });
    
    //Set the query on the first load
    this.store.select(selectTeamsPerPage).pipe(take(1)).subscribe(value => 
    {
      this.searchService.setQueryTeamsPerPage(value); // Set query on first load
      this.paginationForm.controls.teamsPerPage.setValue(value); // Set form control on first load
    });
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
}
