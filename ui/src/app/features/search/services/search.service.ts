import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tag } from '../../team/models/tag.model';
import { TeamPreview } from '../../team/models/teamPreview.model';
import { TeamService } from '../../team/services/team.service';
import { SearchQueryDTO } from '../models/searchQuery.dto';
import { SearchQueryResponseDTO } from '../models/searchQueryResponse.dto';
import { SetOperation } from '../models/setOperation.enum';
import { SortOrder, SortType, SortWay } from '../models/sortOrder.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService 
{
  teamService = inject(TeamService);

  private query$: BehaviorSubject<SearchQueryDTO>
    = new BehaviorSubject<SearchQueryDTO>(<SearchQueryDTO>{});
  query = this.query$.asObservable();

  private teams$: BehaviorSubject<TeamPreview[]>
    = new BehaviorSubject<TeamPreview[]>([]);
  teams = this.teams$.asObservable();

  private totalTeams$: BehaviorSubject<number>
    = new BehaviorSubject<number>(0);
  totalTeams = this.totalTeams$.asObservable();

  private searched$: BehaviorSubject<boolean>
    = new BehaviorSubject<boolean>(false);
  searched = this.searched$.asObservable();

  constructor() 
  {
    this.setQueryTags([]);
    this.setQueryTeamsPerPage(10);
    this.setQuerySelectedPage(1);
    this.setQuerySortOrder(
      {
        type: SortType.date,
        way: SortWay.descending
      }
    );
    this.setQuerySetOperation(SetOperation.intersection);
  }

  setTeams(teams: TeamPreview[])
  {
    this.teams$.next(teams);
  }

  setSearched(searched: boolean)
  {
    this.searched$.next(searched);
  }

  setTotalTeams(totalTeams: number)
  {
    this.totalTeams$.next(totalTeams);
  }
  
  defaultSearch()
  {
    this.setQuerySelectedPage(1);
    this.search(this.query$.getValue());
  }

  pageChangeSearch()
  {
    this.search(this.query$.getValue());
  }
  
  search(searchQuery: SearchQueryDTO)
  {
    this.setSearched(true);
    console.log(searchQuery)
    this.teamService.searchTeams(searchQuery)?.subscribe(
      {
        next: (response: SearchQueryResponseDTO) => 
        {
          this.setTeams(response.teams);
          this.setTotalTeams(response.totalTeams);
        },
        error: (error) => 
        {
          console.log("Team search error", error);
          //display error
          this.setSearched(false);
        },
        complete: () => 
        {
          this.setSearched(false);
        }
      }
    )
  }

  setQuery(query: SearchQueryDTO)
  {
    this.query$.next(query);
  }

  setQueryTags(tags: Tag[])
  {
    this.query$.next(
      {...this.query$.getValue(), queries: [...tags]}
    )
  }

  setQueryTeamsPerPage(teamsPerPage: number)
  {
    this.query$.next(
      {...this.query$.getValue(), teamsPerPage: teamsPerPage}
    )
  }

  setQuerySelectedPage(selectedPage: number)
  {
    this.query$.next(
      {...this.query$.getValue(), selectedPage: selectedPage}
    )
  }

  setQuerySortOrder(sortOrder: SortOrder)
  {
    this.setQuerySelectedPage(1);
    this.query$.next(
      {...this.query$.getValue(), sortOrder: sortOrder}
    )
  }

  setQuerySetOperation(setOperation: SetOperation)
  {
    this.setQuerySelectedPage(1);
    this.query$.next(
      {...this.query$.getValue(), setOperation: setOperation}
    )
  }

  getCurrentPage(): number
  {
    return this.query$.getValue().selectedPage ?? 1;
  }
}