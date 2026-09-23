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
    expect(service.query()).toStrictEqual(resetQuery);
  })

  describe("setTeams()", () =>
  {
    it("should set the correct teams", () =>
    {
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

      expect(service.teams()).toStrictEqual(newTeams);
    })

    it("should set empty teams", () =>
    {
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

      expect(service.teams()).toStrictEqual([]);
    })
  })

  describe("setSearched()", () =>
  {
    it("should set the correct searched flag", () =>
    {
      expect(service.searched()).toBe(false);

      service.setSearched(true);

      expect(service.searched()).toBe(true);
    })
  })

  describe("setSearchError()", () =>
  {
    it("should set the correct search error", () =>
    {
      expect(service.searchError()).toMatch("");

      service.setSearchError("testSearchError");

      expect(service.searchError()).toMatch("testSearchError");
    })
  })

  describe("setTotalTeams()", () =>
  {
    it("should set the correct total teams", () =>
    {
      expect(service.totalTeams()).toBe(0);

      service.setTotalTeams(5);

      expect(service.totalTeams()).toBe(5);
    })
  })

  describe("setQuery()", () =>
  {
    it("should set the correct query", () =>
    {
      expect(service.query()).toStrictEqual(resetQuery);

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

      expect(service.query()).toStrictEqual(newQuery);
    })
  })

  describe("setQueryItems()", () =>
  {
    it("should set the correct query items", () =>
    {
      expect(service.query()).toStrictEqual(resetQuery);

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

      expect(service.query()).toStrictEqual(newQuery);
    })

    it("should set empty query items", () =>
    {
      expect(service.query()).toStrictEqual(resetQuery);

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

      expect(service.query()).toStrictEqual(newQuery);

      service.setQueryItems([]);

      expect(service.query()).toStrictEqual(resetQuery);
    })
  })

  describe("setQueryTeamsPerPage()", () =>
  {
    it("should set the correct query teams per page", () =>
    {
      expect(service.query()).toStrictEqual(resetQuery);

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

      expect(service.query()).toStrictEqual(newQuery);
    })
  })

  describe("setQuerySelectedPage()", () =>
  {
    it("should set the correct query selected page", () =>
    {
      expect(service.query()).toStrictEqual(resetQuery);

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

      expect(service.query()).toStrictEqual(newQuery);
    })
  })

  describe("setQuerySortOrder()", () =>
  {
    it("should set the correct query sort order", () =>
    {
      expect(service.query()).toStrictEqual(resetQuery);

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

      expect(service.query()).toStrictEqual(preQuery);

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

      expect(service.query()).toStrictEqual(newQuery);
    })
  })

  describe("setQuerySetOperation()", () =>
  {
    it("should set the correct query set operation", () =>
    {
      expect(service.query()).toStrictEqual(resetQuery);

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

      expect(service.query()).toStrictEqual(preQuery);

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

      expect(service.query()).toStrictEqual(newQuery);
    })
  })

  describe("getCurrentPage()", () =>
  {
    it("should get the correct current page", () =>
    {
      expect(service.query()).toStrictEqual(resetQuery);

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

      expect(service.query()).toStrictEqual(preQuery);
      expect(service.getCurrentPage()).toBe(16);
    })
  })

  describe("search()", () =>
  {
    beforeEach(() =>
    {
      expect(service.query()).toStrictEqual(resetQuery);
      expect(service.teams()).toStrictEqual([]);
      expect(service.totalTeams()).toBe(0);
      expect(service.searchError()).toBe("");
      expect(service.searched()).toBe(false);
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

      expect(service.teams()).toStrictEqual(response.teams);
      expect(service.totalTeams()).toStrictEqual(response.totalTeams);
      expect(service.searchError()).toStrictEqual("");

    })
  })
});
