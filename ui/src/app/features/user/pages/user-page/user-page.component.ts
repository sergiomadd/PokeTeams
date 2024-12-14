import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAccessToken } from 'src/app/core/auth/store/auth.selectors';
import { JwtTokenService } from 'src/app/core/services/jwttoken.service';
import { SearchService } from 'src/app/features/search/services/search.service';
import { TeamPreview } from 'src/app/features/team/models/teamPreview.model';
import { User } from '../../models/user.model';
import { UserPageService } from '../../services/user-page.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent 
{
  userService = inject(UserService);
  userPageService = inject(UserPageService);
  store = inject(Store);
  searchService = inject(SearchService);
  route = inject(ActivatedRoute);
  jwtTokenService = inject(JwtTokenService);

  @Input() username?: string;

  user?: User;
  userTeams: TeamPreview[] = [];
  loading: boolean = false;

  tabs: boolean[] = [true, false]
  country?: string;
  userPrivate: boolean = false;

  accessToken$ = this.store.select(selectAccessToken);
  loggedUsername?: string;

  ngOnInit()
  {
    this.route.params.subscribe(params =>
      {
        this.username = params["username"];
        if(this.username)
        {
          this.loading = true;
          this.updateUser(this.username);
          this.searchService.teams.subscribe((value: TeamPreview[]) =>
          {
            this.userTeams = value;
          })
        }
        this.searchService.teams.subscribe((value: TeamPreview[]) =>
        {
          this.userTeams = value;
        })
      })
    this.accessToken$.subscribe(async value => 
      {
        if(value) 
        {
          this.loggedUsername = this.jwtTokenService.getTokenUsername(value);
          if(this.username && this.loggedUsername && this.username === this.loggedUsername)
          {
            this.updateUser(this.username)
          }
        }
        else
        {
          this.loggedUsername = undefined;
        }
      })
  }

  updateUser(username: string)
  {
    this.userService.getUser(username).subscribe(
      {
        next: (response) =>
        {
          this.user = response;
          this.userPageService.setUser(this.user);
          this.load();
        },
        error: () => 
        {
          this.loading = false;
        },
        complete: () => 
        {
          this.loading = false;
        }
      }
    )
  }

  load()
  {
    if(!this.user?.visibility && !(this.loggedUsername === this.user?.username))
    {
      this.userPrivate = true;
    }
    else
    {
      this.userPrivate = false;
      if(this.user) { this.searchService.userOnlySearch(this.user.username);}
    }
  }

  changeTab(index: number)
  {
    for (let i=0; i<this.tabs.length; i++) 
    {
      this.tabs[i] = false;
    }
    this.tabs[index] = true;
  }
}
