import { Component, inject, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SearchQueryDTO } from 'src/app/models/DTOs/searchQuery.dto';
import { SearchQueryResponseDTO } from 'src/app/models/DTOs/searchQueryResponse.dto';
import { TeamSearchOrder } from 'src/app/models/enums/teamSearchOrder.enum';
import { Tag } from 'src/app/models/tag.model';
import { TeamPreview } from 'src/app/models/teamPreview.model';
import { PokemonService } from 'src/app/services/pokemon.service';
import { QueryService } from 'src/app/services/query.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import { PaginationComponent } from '../pieces/pagination/pagination.component';
import { ResultStorageComponent } from '../pieces/result-storage/result-storage.component';

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

  //pagination
  teamsPerPage: number = 5;
  totalTeams?: number;
  sortOrder: TeamSearchOrder = TeamSearchOrder.ViewsDescending;
  @ViewChild(PaginationComponent) paginationComponent!: PaginationComponent;

  @ViewChild('query') queryResultStorageComponent?: ResultStorageComponent;
  querySelectEvent($event: Tag)
  {
    this.queryResultStorageComponent?.results?.push($event);
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

  }

  buildQueryFromForm(): SearchQueryDTO
  {
    let searchQuery: SearchQueryDTO = 
    {
      queries: this.queryResultStorageComponent?.results ?? [],
      teamsPerPage: this.teamsPerPage,
      selectedPage: 1,
      order: this.sortOrder
    }
    return searchQuery;
  }

  defaultSearch()
  {
    this.search(this.buildQueryFromForm());
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

  //sorting
  sorterSettings: (TeamSearchOrder | undefined)[] = [undefined, TeamSearchOrder.ViewsDescending];

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
    let searchQuery: SearchQueryDTO = this.buildQueryFromForm();
    searchQuery.selectedPage = 1;
    this.paginationComponent.currentPage = 1;
    searchQuery.order = newOrder;
    this.sortOrder = newOrder;
    this.search(searchQuery);
  }

  pageChange($event, container)
  {
    container.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    let searchQuery: SearchQueryDTO = this.buildQueryFromForm();
    searchQuery.selectedPage = $event;
    this.search(searchQuery);
  }
}
