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
  @Input() user?: User;

  userService: UserService = inject(UserService);

  async ngOnInit()
  {
    console.log("init user")
    this.user = await this.userService.loadUser();
    /*
    {
      name: "sergio",
      username: "sergiomadd",
      picture: "url",
      teams: [await this.generateTeam.getTeam("/lcr0ygrz3l"), await this.generateTeam.getTeam("/ydl0ls8zqi"), await this.generateTeam.getTeam("/njw8dvel6o")]
    }
    */
    console.log("user:", this.user)
  }
}
