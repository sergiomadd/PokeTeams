import { Component, Input, SimpleChanges, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { GenerateTeamService } from 'src/app/services/generate-team.service';
import { UserService } from 'src/app/services/user.service';
import { selectLoggedUser } from 'src/app/state/auth/auth.reducers';

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
  sections: boolean[] = [false, false, true]
  country?: string;

  data$ = combineLatest(
    {
      loggedUser: this.store.select(selectLoggedUser),
    }
  )

  async ngOnInit()
  {
    this.user = this.userName ? await this.userService.getUser(this.userName) : undefined;
    this.data$.forEach(item => 
      {
        if(item.loggedUser != null && item.loggedUser?.username === this.user?.username)
        {
          this.user = item.loggedUser;
        }
      })
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
