import { inject, Injectable, signal } from '@angular/core';
import { QueryItem } from '../../core/models/misc/queryResult.model';
import { SearchQueryDTO } from '../../core/models/search/searchQuery.dto';
import { SearchQueryResponseDTO } from '../../core/models/search/searchQueryResponse.dto';
import { SetOperation } from '../../core/models/search/setOperation.enum';
import { SortOrder, SortType, SortWay } from '../../core/models/search/sortOrder.model';
import { TeamPreviewData } from '../../core/models/team/teamPreviewData.model';
import { TeamService } from '../../core/services/team.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService
{
  teamService = inject(TeamService);

  query = signal<SearchQueryDTO>(<SearchQueryDTO>{});
  teams = signal<TeamPreviewData[]>([]);
  totalTeams = signal<number>(0);
  searched = signal<boolean>(false);
  searchError = signal<string>("");

  constructor()
  {
    this.resetQuery();
  }

  resetTeams()
  {
    this.teams.set([]);
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
    this.teams.set(teams);
  }

  setSearched(searched: boolean)
  {
    this.searched.set(searched);
  }

  setSearchError(searchError: string)
  {
    this.searchError.set(searchError);
  }

  setTotalTeams(totalTeams: number)
  {
    this.totalTeams.set(totalTeams);
  }

  resetDefaultSearch()
  {
    this.resetQuery();
    this.search(this.query());
  }

  defaultSearch()
  {
    this.setQuerySelectedPage(1);
    this.search(this.query());
  }

  pageChangeSearch()
  {
    this.search(this.query());
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
    this.search(this.query());
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
          this.setSearchError("");
        },
        error: (error) =>
        {
          this.setSearched(false);
          this.setSearchError(error.message);
          this.setTeams([]);
          this.setTotalTeams(0);
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
    this.query.set(query);
  }

  setQueryItems(queryItems: QueryItem[])
  {
    this.query.update(query => ({...query, queries: [...queryItems]}));
  }

  setQueryTeamsPerPage(teamsPerPage: number)
  {
    this.query.update(query => ({...query, teamsPerPage: teamsPerPage}));
  }

  setQuerySelectedPage(selectedPage: number)
  {
    this.query.update(query => ({...query, selectedPage: selectedPage}));
  }

  setQuerySortOrder(sortOrder: SortOrder)
  {
    this.setQuerySelectedPage(1);
    this.query.update(query => ({...query, sortOrder: sortOrder}));
  }

  setQuerySetOperation(setOperation: SetOperation)
  {
    this.setQuerySelectedPage(1);
    this.query.update(query => ({...query, setOperation: setOperation}));
  }

  getCurrentPage(): number
  {
    return this.query().selectedPage ?? 1;
  }
}
