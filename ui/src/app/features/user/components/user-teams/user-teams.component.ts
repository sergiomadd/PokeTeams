import { Component, inject } from '@angular/core';
import { SearchService } from 'src/app/features/search/services/search.service';
import { TeamPreview } from 'src/app/features/team/models/teamPreview.model';
import { User } from '../../models/user.model';
import { UserPageService } from '../../services/user-page.service';

@Component({
  selector: 'app-user-teams',
  templateUrl: './user-teams.component.html',
  styleUrl: './user-teams.component.scss'
})
export class UserTeamsComponent 
{
  userPageService = inject(UserPageService);
  searchService = inject(SearchService);

  user?: User;
  teams: TeamPreview[] = [];

  ngOnInit()
  {
    this.userPageService.user.subscribe((value: User) => 
    {
      if(value)
      {
        console.log("user", value)
        this.user = value;
        this.searchService.userOnlySearch(this.user.username)
      }
    })

    this.searchService.teams.subscribe((value: TeamPreview[]) =>
    {
      this.teams = value;
    })
  }
}
