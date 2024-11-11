import { Component, inject, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectLoggedUser } from 'src/app/auth/store/auth.selectors';
import { ThemeService } from 'src/app/core/services/theme.service';
import { Layout } from 'src/app/features/search/models/layout.enum';
import { SortOrder, SortType, SortWay } from 'src/app/features/search/models/sortOrder.model';
import { QueryService } from 'src/app/features/search/services/query.service';
import { Tag } from 'src/app/features/team/models/tag.model';
import { TeamPreview } from 'src/app/features/team/models/teamPreview.model';
import { TeamService } from 'src/app/features/team/services/team.service';
import { User } from 'src/app/features/user/models/user.model';
import { UtilService } from 'src/app/shared/services/util.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { SearchQueryDTO } from '../../models/searchQuery.dto';
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
  formBuilder = inject(FormBuilder);
  teamService = inject(TeamService);
  store = inject(Store);
  util = inject(UtilService);
  theme = inject(ThemeService)
  searchService = inject(SearchService);

  teams: TeamPreview[] = [];
  sortedTeams: TeamPreview[] = [];
  tags: Tag[] = [];
  loggedUser$ = this.store.select(selectLoggedUser);
  user?: User;
  userSelected: boolean = false;
  searched: boolean = false;
  layout: Layout = Layout.double;
  unionType: SetOperation = SetOperation.intersection;
  unionTypeSettings: SetOperation[] = [SetOperation.intersection, SetOperation.union];

  sortTypeNames: string[] = ["Date", "Views"];
  sortOrder: SortOrder = 
  {
    type: SortType.date,
    way: SortWay.descending
  };

  //pagination
  paginationForm = this.formBuilder.group(
    {
      teamsPerPage: [10, [Validators.min(1), Validators.max(100)]]
    }, { updateOn: "blur" });
  totalTeams?: number;
  @ViewChild(PaginationComponent) paginationComponent!: PaginationComponent;

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes['teams'])
    {
      this.sortedTeams = [...this.teams];
      this.searched = false;
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
        this.totalTeams = value
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
            this.defaultSearch();
          }
        }
      }
    );
    this.searchService.search(this.buildQuery());
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
    if($event.identifier === this.user?.username) 
    { 
      this.userSelected = false;
      this.defaultSearch();
    }
  }

  tagsSettingsSelectEvent($event)
  {
    this.unionType = $event;
  }

  buildQuery(): SearchQueryDTO
  {
    let searchQuery: SearchQueryDTO = 
    {
      queries: this.tags ?? [],
      teamsPerPage: this.paginationForm.controls.teamsPerPage.value ?? 20,
      selectedPage: 1,
      sortOrder: this.sortOrder,
      setOperation: this.unionType
    }
    return searchQuery;
  }

  buildQueryLastest(): SearchQueryDTO
  {
    let searchQuery: SearchQueryDTO = 
    {
      queries: this.tags ?? [],
      teamsPerPage: this.paginationForm.controls.teamsPerPage.value ?? 20,
      selectedPage: 1,
      sortOrder: this.sortOrder,
      setOperation: this.unionType
    }
    return searchQuery;
  }

  defaultSearch()
  {
    this.searchService.search(this.buildQuery());
  }

  reset()
  {
    this.tags = [];
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
      this.defaultSearch();
    }
    else
    {
      const index = this.tags.findIndex(t => t.identifier == userTag.identifier);
      if(index > -1)
      {
        this.tags.splice(index, 1);
        this.defaultSearch();
      }
    }
  }

  isTeamOwnerLogged(team: TeamPreview)
  {
    return team.player?.username === this.user?.username;
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
