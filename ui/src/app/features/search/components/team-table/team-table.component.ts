import { Component, inject, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ThemeService } from 'src/app/core/services/theme.service';
import { TeamPreview } from 'src/app/features/team/models/teamPreview.model';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { UtilService } from 'src/app/shared/services/util.service';
import { Layout } from '../../models/layout.enum';
import { SortOrder, SortType, SortWay } from '../../models/sortOrder.model';
import { SearchService } from '../../services/search.service';

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
  theme = inject(ThemeService);

  teams: TeamPreview[] = [];
  searched: boolean = false;
  layout: Layout = Layout.double;

  sortTypeNames: string[] = ["Date", "Views"];
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

  
  async ngOnInit()
  {
    this.searchService.teams.subscribe((value: TeamPreview[]) =>
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
            this.searchService.setQueryTeamsPerPage(value);
            this.searchService.defaultSearch();
          }
        }
      }
    )
  }

  changeLayout(columNumber: number)
  {
    switch(columNumber)
    {
      case 0:
        this.layout = Layout.single
        break;
      case 1:
        this.layout = Layout.double
        break;
    }
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
    container.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    this.searchService.setQuerySelectedPage($event);
    this.searchService.pageChangeSearch();
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
