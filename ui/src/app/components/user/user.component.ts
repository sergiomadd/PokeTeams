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

  ngOnInit()
  {
    this.init()
  }

  ngOnChanges(changes: SimpleChanges)
  {
    console.log("changes", changes)
    if(changes["userName"])
    {
      this.init()
    }
    console.log(this.userName)
  }

  async init()
  {
    this.user = this.userName ? await this.userService.getUser(this.userName) : undefined;
    this.user?.country ? this.country = `assets/${this.user?.country}.png` : undefined;
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
