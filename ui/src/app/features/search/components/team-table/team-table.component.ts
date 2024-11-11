import { Component, inject, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectLoggedUser } from 'src/app/auth/store/auth.selectors';
import { ThemeService } from 'src/app/core/services/theme.service';
import { Tag } from 'src/app/features/team/models/tag.model';
import { TeamPreview } from 'src/app/features/team/models/teamPreview.model';
import { User } from 'src/app/features/user/models/user.model';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { UtilService } from 'src/app/shared/services/util.service';
import { Layout } from '../../models/layout.enum';
import { SearchQueryDTO } from '../../models/searchQuery.dto';
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
  store = inject(Store);

  teams: TeamPreview[] = [];
  sortedTeams: TeamPreview[] = [];
  searched: boolean = false;

  loggedUser$ = this.store.select(selectLoggedUser);
  user?: User;
  userSelected: boolean = false;

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

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['teams'])
    {
      this.sortedTeams = [...this.teams];
    }
  }

  
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
      }
    );

    this.loggedUser$.subscribe(
      {
        next: (value) =>
        {
          this.user = value ?? undefined;
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
            this.searchService.defaultSearch();
          }
        }
      })
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


  async toggleLoggedUser()
  {
    this.userSelected = !this.userSelected;
    const userTag: Tag = 
    {
      name: this.user?.username ?? "",
      identifier: this.user?.username ?? "",
      icon: this.user?.picture,
      type: "username"
    }
    if(this.userSelected)
    {
      this.querySelectEvent(userTag);
      this.searchService.defaultSearch();
    }
    else
    {
      const index = this.tags.findIndex(t => t.identifier == userTag.identifier);
      if(index > -1)
      {
        this.tags.splice(index, 1);
        this.searchService.defaultSearch();
      }
    }
  }


  isTeamOwnerLogged(team: TeamPreview)
  {
    return team.player?.username === this.user?.username;
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
    let searchQuery: SearchQueryDTO = this.buildQuery();
    searchQuery.selectedPage = 1;
    this.paginationComponent.currentPage = 1;
    this.searchService.search(searchQuery);
  }

  pageChange($event, container)
  {
    container.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    let searchQuery: SearchQueryDTO = this.buildQuery();
    searchQuery.selectedPage = $event;
    this.searchService.search(searchQuery);
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
