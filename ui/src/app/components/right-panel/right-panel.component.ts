import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent 
{
  user?: User | null = null;
  userService: UserService = inject(UserService);
  router = inject(Router)


  async ngOnInit()
  {
    this.user = await this.userService.getLoggedUser();
  }

}
