import { Component, inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { selectLoggedUser } from 'src/app/auth/store/auth.selectors';
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

  @Input() userName?: string;

  user?: User;
  sections: boolean[] = [true, false, false]
  country?: string;

  data$ = combineLatest(
    {
      loggedUser: this.store.select(selectLoggedUser),
    }
  )

  //igual mejor subir esto a user page
  async ngOnInit()
  {
    //this.searchService.setQueryTags()
    //search only user teams

    this.user = this.userName ? await this.userService.getUser(this.userName) : undefined;
    if(this.user)
    {
      this.userPageService.setUser(this.user);
    }

    this.data$.forEach(async item => 
      {
        if(item.loggedUser != null && item.loggedUser?.username === this.user?.username)
        {
          //item.loggedUser = await this.userService.loadUserTeams(item.loggedUser);
          //this.user = item.loggedUser;
        }
      });
      
      console.log("User in user page:", this.user)
  }

  changeSection(index: number)
  {
    for (let i=0; i<this.sections.length; i++) 
    {
      this.sections[i] = false;
    }
    this.sections[index] = true;
  }
}
