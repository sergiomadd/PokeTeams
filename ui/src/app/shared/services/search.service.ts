import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QueryItem } from 'src/app/core/models/misc/queryResult.model';
import { SearchQueryResponseDTO } from 'src/app/core/models/search/searchQueryResponse.dto';
import { SetOperation } from 'src/app/core/models/search/setOperation.enum';
import { SortOrder, SortType, SortWay } from 'src/app/core/models/search/sortOrder.model';
import { TeamPreviewData } from 'src/app/core/models/team/teamPreviewData.model';
import { TeamService } from 'src/app/core/services/team.service';
import { SearchQueryDTO } from '../../core/models/search/searchQuery.dto';

@Injectable({
  providedIn: 'root'
})
export class SearchService 
{
  teamService = inject(TeamService);

  private query$: BehaviorSubject<SearchQueryDTO> = new BehaviorSubject<SearchQueryDTO>(<SearchQueryDTO>{});
  query = this.query$.asObservable();

  private teams$: BehaviorSubject<TeamPreviewData[]> = new BehaviorSubject<TeamPreviewData[]>([]);
  teams = this.teams$.asObservable();

  private totalTeams$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalTeams = this.totalTeams$.asObservable();

  private searched$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  searched = this.searched$.asObservable();

  constructor() 
  {
    this.resetQuery();
  }

  resetTeams()
  {
    this.teams$.next([]);
  }

  resetQuery()
  {
    this.setQueryItems([]);
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

  setTeams(teams: TeamPreviewData[])
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

  resetDefaultSearch()
  {
    this.resetQuery();
    this.search(this.query$.getValue());
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

  userOnlySearch(username: string)
  {
    const queryItems: QueryItem[] = 
    [
      {
        name: username,
        identifier: username,
        type: "user"
      }
    ]
    this.setQueryItems(queryItems);
    this.search(this.query$.getValue());
  }
  
  search(searchQuery: SearchQueryDTO)
  {
    this.setSearched(true);
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

  setQueryItems(queryItems: QueryItem[])
  {
    this.query$.next(
      {...this.query$.getValue(), queries: [...queryItems]}
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