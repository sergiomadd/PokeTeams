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
  //@Input() user?: User;
  @Input() userName?: string;

  user?: User;
  logged?: boolean = false;
  userService: UserService = inject(UserService);
  sections: boolean[] = [true, false, false]

  async ngOnInit()
  {
    console.log("url username", this.userName);
    this.user = this.userName ? await this.userService.getUser(this.userName) : undefined;
    this.logged = this.user?.username == (await this.userService.loadUser()).username;
    console.log("user:", this.user)
  }

  changeSection(index: number)
  {
    for (let i=0; i<this.sections.length; i++) 
    {
      this.sections[i] = false;
    }
    this.sections[index] = true;
  }
  /*
  sortTeams()
  {
    //By date
    // Sort by date string in ascending order
    this.user?.teams?.sort(function(a, b) 
    {
    // Convert the date strings to Date objects
    if(a.date && b.date)
    {
      let dateA = new Date(a.date);
      let dateB = new Date(b.date);
  
      // Subtract the dates to get a value that is either negative, positive, or zero
      //return dateA - dateB;
      console.log(dateA)
      return 1;
    }

    // Subtract the dates to get a value that is either negative, positive, or zero
    return 0;
    });
  }
  */
}
