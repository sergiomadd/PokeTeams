import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TeamPreview } from '../../team/models/teamPreview.model';
import { TeamService } from '../../team/services/team.service';
import { SearchQueryDTO } from '../models/searchQuery.dto';
import { SearchQueryResponseDTO } from '../models/searchQueryResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class SearchService 
{
  teamService = inject(TeamService);

  private teams$: BehaviorSubject<TeamPreview[]>
    = new BehaviorSubject<TeamPreview[]>([]);
  teams = this.teams$.asObservable();

  private searched$: BehaviorSubject<boolean>
    = new BehaviorSubject<boolean>(false);
  searched = this.searched$.asObservable();

  private totalTeams$: BehaviorSubject<number>
    = new BehaviorSubject<number>(0);
  totalTeams = this.totalTeams$.asObservable();

  constructor() { }

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
        },
        complete: () => 
        {
          this.setSearched(false);
        }
      }
    )
  }
}
