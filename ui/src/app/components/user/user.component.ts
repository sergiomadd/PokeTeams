import { Component, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { selectLoggedUser } from 'src/app/auth/store/auth.selectors';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent 
{
  store = inject(Store);
  userService: UserService = inject(UserService);

  @Input() userName?: string;

  user?: User;
  sections: boolean[] = [true, false, false]
  country?: string;

  data$ = combineLatest(
    {
      loggedUser: this.store.select(selectLoggedUser),
    }
  )

  async ngOnInit()
  {
    this.user = this.userName ? await this.userService.getUser(this.userName) : undefined;
    
    this.data$.forEach(async item => 
    {
      if(item.loggedUser != null && item.loggedUser?.username === this.user?.username)
      {
        item.loggedUser = await this.userService.loadUserTeams(item.loggedUser);
        this.user = item.loggedUser;
      }
    });
    
    console.log("user in component:", this.user)
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
