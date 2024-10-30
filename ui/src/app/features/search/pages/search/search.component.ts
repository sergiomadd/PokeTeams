import { Component, inject, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectLoggedUser } from 'src/app/auth/store/auth.selectors';
import { PokemonService } from 'src/app/features/pokemon/services/pokemon.service';
import { Layout } from 'src/app/features/search/models/layout.enum';
import { TeamSearchOrder } from 'src/app/features/search/models/teamSearchOrder.enum';
import { QueryService } from 'src/app/features/search/services/query.service';
import { Tag } from 'src/app/features/team/models/tag.model';
import { TeamPreview } from 'src/app/features/team/models/teamPreview.model';
import { TeamService } from 'src/app/features/team/services/team.service';
import { User } from 'src/app/features/user/models/user.model';
import { UserService } from 'src/app/features/user/services/user.service';
import { SearchQueryDTO } from 'src/app/models/DTOs/searchQuery.dto';
import { SearchQueryResponseDTO } from 'src/app/models/DTOs/searchQueryResponse.dto';
import { UtilService } from 'src/app/shared/services/util.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent 
{
  queryService = inject(QueryService);
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);
  teamService = inject(TeamService);
  pokemonService = inject(PokemonService);
  store = inject(Store);
  util = inject(UtilService);

  teams: TeamPreview[] = [];
  loggedUser$ = this.store.select(selectLoggedUser);
  user?: User;
  userSelected: boolean = false;
  sortedTeams: TeamPreview[] = [];
  searched: boolean = false;
  tags: Tag[] = [];
  layout: Layout = Layout.single;

  //pagination
  paginationForm = this.formBuilder.group(
    {
      teamsPerPage: [10, [Validators.min(1), Validators.max(100)]]
    }, { updateOn: "blur" });
  totalTeams?: number;
  sortOrder: TeamSearchOrder = TeamSearchOrder.DateDescending;
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
    this.paginationForm.controls.teamsPerPage.valueChanges.subscribe(value =>
      {
        if(value)
        {
          if(typeof +value !== "number" || isNaN(+value))
          {
            this.paginationForm.controls.teamsPerPage.setErrors({ "nan": true });
          }
          if(this.paginationForm.controls.teamsPerPage.valid)
          {
            this.defaultSearch();
          }
        }
      })
    this.search(this.buildQuery());
    this.loggedUser$.subscribe(
      {
        next: (value) =>
        {
          this.user = value ?? undefined;
        }
      }
    )
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

  buildQuery(): SearchQueryDTO
  {
    let searchQuery: SearchQueryDTO = 
    {
      queries: this.tags ?? [],
      teamsPerPage: this.paginationForm.controls.teamsPerPage.value ?? 20,
      selectedPage: 1,
      order: this.sortOrder
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
      order: TeamSearchOrder.DateDescending
    }
    return searchQuery;
  }

  defaultSearch()
  {
    this.search(this.buildQuery());
  }

  search(searchQuery: SearchQueryDTO)
  {
    this.searched = true;
    this.teamService.searchTeams(searchQuery)?.subscribe(
      {
        next: (response: SearchQueryResponseDTO) => 
        {
          this.teams = response.teams;
          this.sortedTeams = [...response.teams];
          this.totalTeams = response.totalTeams;
        },
        error: (error) => 
        {
          console.log("Team search error", error);
        },
        complete: () => 
        {
          this.searched = false;
        }
      }
    )
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
  sorterSettings: (TeamSearchOrder | undefined)[] = [TeamSearchOrder.DateDescending, undefined];

  changeSorter(index)
  {
    switch(index)
    {
      case 0:
        if(this.sorterSettings[index] === undefined)
        {
          this.resetSorter();
          this.sorterSettings[index] = TeamSearchOrder.DateDescending;
        }
        else if(this.sorterSettings[index] === TeamSearchOrder.DateDescending)
        {
          this.sorterSettings[index] = TeamSearchOrder.DateAscending;
        }
        else if(this.sorterSettings[index] === TeamSearchOrder.DateAscending)
        {
          this.sorterSettings[index] = undefined;
        }
        break;
      case 1:
        if(this.sorterSettings[index] === undefined)
        {
          this.resetSorter();
          this.sorterSettings[index] = TeamSearchOrder.ViewsDescending;
        }
        else if(this.sorterSettings[index] === TeamSearchOrder.ViewsDescending)
        {
          this.sorterSettings[index] = TeamSearchOrder.ViewsAscending;
        }
        else if(this.sorterSettings[index] === TeamSearchOrder.ViewsAscending)
        {
          this.sorterSettings[index] = undefined;
        }
        break;
      default:
        break;
    }
    this.changeOrder(this.sorterSettings[index]!);
  }

  resetSorter()
  {
    for (let i = 0; i < this.sorterSettings.length; i++) 
    {
      this.sorterSettings[i] = undefined
    }
  }

  changeOrder(newOrder: TeamSearchOrder)
  {
    let searchQuery: SearchQueryDTO = this.buildQuery();
    searchQuery.selectedPage = 1;
    this.paginationComponent.currentPage = 1;
    searchQuery.order = newOrder;
    this.sortOrder = newOrder;
    this.search(searchQuery);
  }

  pageChange($event, container)
  {
    container.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    let searchQuery: SearchQueryDTO = this.buildQuery();
    searchQuery.selectedPage = $event;
    this.search(searchQuery);
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
