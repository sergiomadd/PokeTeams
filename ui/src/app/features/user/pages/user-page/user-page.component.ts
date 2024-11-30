import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUser } from 'src/app/auth/store/auth.selectors';
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

  @Input() username?: string;

  user?: User;
  userTeams: TeamPreview[] = [];
  loading: boolean = false;

  tabs: boolean[] = [true, false]
  country?: string;
  userPrivate: boolean = false;

  loggedUser$: Observable<User | null> = this.store.select(selectUser);
  loggedUser: User | null = null;

  load()
  {
    if(!this.user?.visibility
      && !(this.loggedUser && this.loggedUser.username == this.user?.username))
    {
      this.userPrivate = true;
    }
    else
    {
      this.userPrivate = false;
      this.searchService.userOnlySearch(this.user.username);
    }
  }

  async ngOnInit()
  {
    this.route.params.subscribe(params =>
      {
        this.username = params["username"];
        if(this.username)
        {
          this.loading = true;
          this.loggedUser$.subscribe(value => 
            {
              this.loggedUser = value;
              this.load();
            })
          this.userService.getUser(this.username).subscribe(
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
    
          this.searchService.teams.subscribe((value: TeamPreview[]) =>
          {
            this.userTeams = value;
          })
        }
      })
    console.log("User in user page:", this.user)
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
