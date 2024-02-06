import { Component, Input, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { GenerateTeamService } from 'src/app/services/generate-team.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent 
{
  @Input() userName?: string;

  user?: User;
  logged?: boolean = false;
  userService: UserService = inject(UserService);
  sections: boolean[] = [true, false, false]
  country?: string;

  async ngOnInit()
  {
    this.user = this.userName ? await this.userService.getUser(this.userName) : undefined;
    this.logged = await this.userService.getLoggedUser() ? this.user?.username == (await this.userService.getLoggedUser())!.username : false;
    console.log("user:", this.user)
    console.log(this.user?.country)
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
