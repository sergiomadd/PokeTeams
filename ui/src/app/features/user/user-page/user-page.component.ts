import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, skip } from 'rxjs';
import { SeoService } from '../../../core/helpers/seo.service';
import { TeamPreviewData } from '../../../core/models/team/teamPreviewData.model';
import { User } from '../../../core/models/user/user.model';
import { UserService } from '../../../core/services/user.service';
import { selectLoggedUser } from '../../../core/store/auth/auth.selectors';
import { selectLang } from '../../../core/store/config/config.selectors';
import { NotFoundComponent } from '../../../shared/components/dumb/not-found/not-found.component';
import { SearchService } from '../../../shared/services/search.service';
import { UserSettingsComponent } from '../components/user-settings/user-settings.component';
import { UserTeamsComponent } from '../components/user-teams/user-teams.component';
import { UserPageService } from '../services/user-page.service';

@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.component.html',
    styleUrl: './user-page.component.scss',
    imports: [NgClass, UserTeamsComponent, UserSettingsComponent, NotFoundComponent, TranslatePipe]
})
export class UserPageComponent 
{
  userService = inject(UserService);
  userPageService = inject(UserPageService);
  store = inject(Store);
  searchService = inject(SearchService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  seo = inject(SeoService);

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
    this.username = this.router.url.slice(6);
    this.seo.updateMetaData({
      title: `${this.username}`,
      description: 'The user page. It has a list of the users teams, and a settings page where the user can change their profile and account details.',
      slug: `user/${this.username}`,
    });
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
