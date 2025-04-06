import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, skip } from 'rxjs';
import { TeamPreviewData } from 'src/app/core/models/team/teamPreviewData.model';
import { selectLoggedUser } from 'src/app/core/store/auth/auth.selectors';
import { selectLang } from 'src/app/core/store/config/config.selectors';
import { SearchService } from 'src/app/shared/services/search.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../models/user.model';
import { UserPageService } from '../services/user-page.service';

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
  router = inject(Router);

  selectedLang$: Observable<string> = this.store.select(selectLang);
  loggedUser$ = this.store.select(selectLoggedUser);
  loggedUsername?: string;

  username?: string;
  user?: User;
  userTeams: TeamPreviewData[] = [];
  loading: boolean = false;

  tabs: boolean[] = [true, false]
  country?: string;
  userPrivate: boolean = false;

  ngOnInit()
  {
    console.log("url ", this.router.url);
    this.username = this.router.url.slice(1);
    this.route.params.subscribe(params =>
    {
      this.username = params["username"];
      if(this.username)
      {
        this.loading = true;
        this.userService.getUser(this.username).subscribe(
          {
            next: (response) =>
            {
              this.user = response;
              this.userPageService.setUser(response);
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
    })
    this.loggedUser$.subscribe(value =>
    {
      if(value) 
      {
        this.loggedUsername = value?.username;
        if(this.username && this.loggedUsername && this.username === this.loggedUsername)
        {
          this.userPageService.getloggedUserEmail(value)
          this.user = value;
          this.userPageService.setUser(value);
        }
      }
      else
      {
        this.loggedUsername = undefined;
      }
    })

    //needed to not repeat same query twice
    this.loggedUser$.pipe(skip(1)).subscribe(value =>
      {
        if(value) 
        {
          if(this.username && this.loggedUsername && this.username === this.loggedUsername)
          {
            this.load();
          }
        }
        else
        {
          this.loggedUsername = undefined;
        }
      })
    this.searchService.teams.subscribe((value: TeamPreviewData[]) =>
    {
      this.userTeams = value;
    })
    this.selectedLang$.pipe(skip(1)).subscribe(value =>
    {
      this.load();
    });
  }

  ngOnDestroy()
  {
    this.searchService.resetTeams();
  }

  load()
  {
    if(this.user) 
    { 
      if(!this.user.visibility && !(this.loggedUsername === this.user.username))
      {
        this.userPrivate = true;
      }
      else
      {
        this.userPrivate = false;
        this.searchService.userOnlySearch(this.user.username);
      }    
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
