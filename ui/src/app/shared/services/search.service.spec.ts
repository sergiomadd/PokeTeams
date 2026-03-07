import { TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';
import { QueryItem } from '../../core/models/misc/queryResult.model';
import { SearchQueryDTO } from '../../core/models/search/searchQuery.dto';
import { SearchQueryResponseDTO } from '../../core/models/search/searchQueryResponse.dto';
import { SetOperation } from '../../core/models/search/setOperation.enum';
import { SortOrder, SortType, SortWay } from '../../core/models/search/sortOrder.model';
import { TeamOptions } from '../../core/models/team/teamOptions.model';
import { TeamPreviewData } from '../../core/models/team/teamPreviewData.model';
import { TeamService } from '../../core/services/team.service';
import { SearchService } from './search.service';

class MockTeamService
{ 
  searchTeams(searchQuery: SearchQueryDTO) : Observable<SearchQueryResponseDTO> | undefined
  {
    const response: SearchQueryResponseDTO =
    {
      teams: 
      [
        {
          id: "testFromMock",
          pokemonIDs: [],
          options: <TeamOptions>{},
          viewCount: 0,
          visibility: true
        }
      ],
      totalTeams: 0
    } 

    return of(response)
  }
}

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: 
      [
        { provide: TeamService, useClass: MockTeamService },
      ]
    });
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  let resetQuery: SearchQueryDTO = 
  {
    queries: [],
    teamsPerPage: 10,
    selectedPage: 1,
    sortOrder: 
    {
      type: SortType.date,
      way: SortWay.descending
    },
    setOperation: SetOperation.intersection
  }

  it('should initiate with query reset', () => 
  {
    let currentQuery: SearchQueryDTO | undefined;

    service.query.subscribe(value => 
    {
      currentQuery = value
    })

    expect(currentQuery).toStrictEqual(resetQuery);
  })

  describe("setTeams()", () => 
  {
    it("should set the correct teams", () =>
    {
      let currentTeams: TeamPreviewData[] = [];

      service.teams.subscribe(value => 
      {
        currentTeams = value
      })
  
      let newTeams: TeamPreviewData[] = 
      [
        {
          id: "test",
          pokemonIDs: [],
          options: <TeamOptions>{},
          viewCount: 0,
          visibility: true
        }
      ]

      service.setTeams(newTeams);
  
      expect(currentTeams).toStrictEqual(newTeams);
    })

    it("should set empty teams", () => 
    {
      let currentTeams: TeamPreviewData[] = [];

      service.teams.subscribe(value => 
      {
        currentTeams = value
      })
  
      let newTeams: TeamPreviewData[] = 
      [
        {
          id: "test",
          pokemonIDs: [],
          options: <TeamOptions>{},
          viewCount: 0,
          visibility: true
        }
      ]

      service.setTeams(newTeams);
      service.setTeams([]);
  
      expect(currentTeams).toStrictEqual([]);
    })
  })

  describe("setSearched()", () => 
  {
    it("should set the correct searched flag", () =>
    {
      let currentSearched: boolean | undefined;

      service.searched.subscribe(value => 
      {
        currentSearched = value
      })

      expect(currentSearched).toBe(false);

      service.setSearched(true);
  
      expect(currentSearched).toBe(true);
    })
  })

  describe("setSearchError()", () => 
  {
    it("should set the correct search error", () =>
    {
      let currentSearchError: string | undefined;

      service.searchError.subscribe(value => 
      {
        currentSearchError = value
      })

      expect(currentSearchError).toMatch("");

      service.setSearchError("testSearchError");
  
      expect(currentSearchError).toMatch("testSearchError");
    })
  })

  describe("setTotalTeams()", () => 
  {
    it("should set the correct total teams", () =>
    {
      let currentTotalTeams: number | undefined;

      service.totalTeams.subscribe(value => 
      {
        currentTotalTeams = value
      })

      expect(currentTotalTeams).toBe(0);

      service.setTotalTeams(5);
  
      expect(currentTotalTeams).toBe(5);
    })
  })

  describe("setQuery()", () => 
  {
    it("should set the correct query", () =>
    {
      let currentQuery: SearchQueryDTO | undefined;

      service.query.subscribe(value => 
      {
        currentQuery = value
      })
  
      expect(currentQuery).toStrictEqual(resetQuery);

      let newQuery: SearchQueryDTO = 
      {
        queries: [],
        teamsPerPage: 30,
        selectedPage: 5,
        sortOrder: 
        {
          type: SortType.views,
          way: SortWay.ascending
        },
        setOperation: SetOperation.union
      }

      service.setQuery(newQuery);
  
      expect(currentQuery).toStrictEqual(newQuery);
    })
  })

  describe("setQueryItems()", () => 
  {
    it("should set the correct query items", () =>
    {
      let currentQuery: SearchQueryDTO | undefined;

      service.query.subscribe(value => 
      {
        currentQuery = value
      })
  
      expect(currentQuery).toStrictEqual(resetQuery);

      const newQueryItems: QueryItem[] = 
      [
        {
          name: "test",
          identifier: "test"
        }
      ]

      service.setQueryItems(newQueryItems);

      let newQuery: SearchQueryDTO = 
      {
        queries: 
        [
          {
            name: "test",
            identifier: "test"
          }
        ],
        teamsPerPage: 10,
        selectedPage: 1,
        sortOrder: 
        {
          type: SortType.date,
          way: SortWay.descending
        },
        setOperation: SetOperation.intersection
      }

      expect(currentQuery).toStrictEqual(newQuery);
    })

    it("should set empty query items", () =>
    {
      let currentQuery: SearchQueryDTO | undefined;

      service.query.subscribe(value => 
      {
        currentQuery = value
      })
  
      expect(currentQuery).toStrictEqual(resetQuery);

      const newQueryItems: QueryItem[] = 
      [
        {
          name: "test",
          identifier: "test"
        }
      ]

      service.setQueryItems(newQueryItems);

      let newQuery: SearchQueryDTO = 
      {
        queries: 
        [
          {
            name: "test",
            identifier: "test"
          }
        ],
        teamsPerPage: 10,
        selectedPage: 1,
        sortOrder: 
        {
          type: SortType.date,
          way: SortWay.descending
        },
        setOperation: SetOperation.intersection
      }

      expect(currentQuery).toStrictEqual(newQuery);

      service.setQueryItems([]);

      expect(currentQuery).toStrictEqual(resetQuery);
    })
  })

  describe("setQueryTeamsPerPage()", () => 
  {
    it("should set the correct query teams per page", () =>
    {
      let currentQuery: SearchQueryDTO | undefined;

      service.query.subscribe(value => 
      {
        currentQuery = value
      })
  
      expect(currentQuery).toStrictEqual(resetQuery);

      const newQueryTeamsPerPage: number = 60;

      service.setQueryTeamsPerPage(newQueryTeamsPerPage);

      let newQuery: SearchQueryDTO = 
      {
        queries: [],
        teamsPerPage: 60,
        selectedPage: 1,
        sortOrder: 
        {
          type: SortType.date,
          way: SortWay.descending
        },
        setOperation: SetOperation.intersection
      }

      expect(currentQuery).toStrictEqual(newQuery);
    })
  })

  describe("setQuerySelectedPage()", () => 
  {
    it("should set the correct query selected page", () =>
    {
      let currentQuery: SearchQueryDTO | undefined;

      service.query.subscribe(value => 
      {
        currentQuery = value
      })
  
      expect(currentQuery).toStrictEqual(resetQuery);

      const newQuerySelectedPage: number = 7;

      service.setQuerySelectedPage(newQuerySelectedPage);

      let newQuery: SearchQueryDTO = 
      {
        queries: [],
        teamsPerPage: 10,
        selectedPage: 7,
        sortOrder: 
        {
          type: SortType.date,
          way: SortWay.descending
        },
        setOperation: SetOperation.intersection
      }

      expect(currentQuery).toStrictEqual(newQuery);
    })
  })

  describe("setQuerySortOrder()", () => 
  {
    it("should set the correct query sort order", () =>
    {
      let currentQuery: SearchQueryDTO | undefined;

      service.query.subscribe(value => 
      {
        currentQuery = value
      })
  
      expect(currentQuery).toStrictEqual(resetQuery);

      let preQuery: SearchQueryDTO = 
      {
        queries: [],
        teamsPerPage: 10,
        selectedPage: 13,
        sortOrder: 
        {
          type: SortType.date,
          way: SortWay.descending
        },
        setOperation: SetOperation.intersection
      }

      service.setQuerySelectedPage(13);

      expect(currentQuery).toStrictEqual(preQuery);

      const newQuerySortOrder: SortOrder = 
      {
        type: SortType.views,
        way: SortWay.ascending
      }

      service.setQuerySortOrder(newQuerySortOrder);

      let newQuery: SearchQueryDTO = 
      {
        queries: [],
        teamsPerPage: 10,
        selectedPage: 1,
        sortOrder: 
        {
          type: SortType.views,
          way: SortWay.ascending
        },
        setOperation: SetOperation.intersection
      }

      expect(currentQuery).toStrictEqual(newQuery);
    })
  })

  describe("setQuerySetOperation()", () => 
  {
    it("should set the correct query set operation", () =>
    {
      let currentQuery: SearchQueryDTO | undefined;

      service.query.subscribe(value => 
      {
        currentQuery = value
      })
  
      expect(currentQuery).toStrictEqual(resetQuery);

      let preQuery: SearchQueryDTO = 
      {
        queries: [],
        teamsPerPage: 10,
        selectedPage: 8,
        sortOrder: 
        {
          type: SortType.date,
          way: SortWay.descending
        },
        setOperation: SetOperation.intersection
      }

      service.setQuerySelectedPage(8);

      expect(currentQuery).toStrictEqual(preQuery);

      const newQuerySetOperation: SetOperation = SetOperation.union;

      service.setQuerySetOperation(newQuerySetOperation);

      let newQuery: SearchQueryDTO = 
      {
        queries: [],
        teamsPerPage: 10,
        selectedPage: 1,
        sortOrder: 
        {
          type: SortType.date,
          way: SortWay.descending
        },
        setOperation: SetOperation.union
      }

      expect(currentQuery).toStrictEqual(newQuery);
    })
  })

  describe("getCurrentPage()", () => 
  {
    it("should get the correct current page", () =>
    {
      let currentQuery: SearchQueryDTO | undefined;

      service.query.subscribe(value => 
      {
        currentQuery = value
      })
  
      expect(currentQuery).toStrictEqual(resetQuery);

      let preQuery: SearchQueryDTO = 
      {
        queries: [],
        teamsPerPage: 10,
        selectedPage: 16,
        sortOrder: 
        {
          type: SortType.date,
          way: SortWay.descending
        },
        setOperation: SetOperation.intersection
      }

      service.setQuerySelectedPage(16);

      expect(currentQuery).toStrictEqual(preQuery);
      expect(service.getCurrentPage()).toBe(16);
    })
  })

  describe("search()", () =>
  {
    let currentQuery: SearchQueryDTO | undefined;
    let currentTeams: TeamPreviewData[] | undefined;
    let totalTeams: number | undefined;
    let searchError: string | undefined;
    let searched: boolean | undefined;

    beforeEach(() => 
    {
      service.query.subscribe(value => 
      {
        currentQuery = value
      })
      expect(currentQuery).toStrictEqual(resetQuery);

      service.teams.subscribe(value => 
      {
        currentTeams = value
      })
      expect(currentTeams).toStrictEqual([]);

      
      service.totalTeams.subscribe(value => 
      {
        totalTeams = value
      })
      expect(currentTeams).toStrictEqual([]);

      service.searchError.subscribe(value => 
      {
        searchError = value
      })
      expect(currentTeams).toStrictEqual([]);

      service.searched.subscribe(value => 
      {
        searched = value
      })
      expect(currentTeams).toStrictEqual([]);
      
    })

    it("should search successfully", () => 
    {
      const response: SearchQueryResponseDTO =
      {
        teams: 
        [
          {
            id: "testFromMock",
            pokemonIDs: [],
            options: <TeamOptions>{},
            viewCount: 0,
            visibility: true
          }
        ],
        totalTeams: 0
      } 

      const teamService = TestBed.inject(TeamService);
      jest.spyOn(teamService, 'searchTeams').mockReturnValue(of(response));

      service.search(resetQuery);

      expect(currentTeams).toStrictEqual(response.teams);
      expect(totalTeams).toStrictEqual(response.totalTeams);
      expect(searchError).toStrictEqual("");

    })
  })
});
