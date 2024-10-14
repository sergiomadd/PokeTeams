import { Component, inject, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PokemonService } from 'src/app/features/pokemon/services/pokemon.service';
import { Layout } from 'src/app/features/search/models/layout.enum';
import { TeamSearchOrder } from 'src/app/features/search/models/teamSearchOrder.enum';
import { QueryService } from 'src/app/features/search/services/query.service';
import { Tag } from 'src/app/features/team/models/tag.model';
import { TeamPreview } from 'src/app/features/team/models/teamPreview.model';
import { TeamService } from 'src/app/features/team/services/team.service';
import { UserService } from 'src/app/features/user/services/user.service';
import { SearchQueryDTO } from 'src/app/models/DTOs/searchQuery.dto';
import { SearchQueryResponseDTO } from 'src/app/models/DTOs/searchQueryResponse.dto';
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

  teams: TeamPreview[] = [];
  logged?: boolean = true;
  sortedTeams: TeamPreview[] = [];
  searched: boolean = false;
  tags: Tag[] = [];
  layout: Layout = Layout.single;

  //pagination
  teamsPerPage: number = 10;
  totalTeams?: number;
  sortOrder: TeamSearchOrder = TeamSearchOrder.DateDescending;
  @ViewChild(PaginationComponent) paginationComponent!: PaginationComponent;

  querySelectEvent($event: Tag)
  {
    this.tags?.push($event);
  }

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
    this.search(this.buildQuery());
  }

  buildQuery(): SearchQueryDTO
  {
    let searchQuery: SearchQueryDTO = 
    {
      queries: this.tags ?? [],
      teamsPerPage: this.teamsPerPage,
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
      teamsPerPage: this.teamsPerPage,
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

  changeLayout()
  {
    if(this.layout === Layout.single) { this.layout = Layout.double }
    else if(this.layout === Layout.double) { this.layout = Layout.single }
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
}
