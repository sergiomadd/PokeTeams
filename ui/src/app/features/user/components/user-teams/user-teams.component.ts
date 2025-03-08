import { Component } from '@angular/core';

@Component({
  selector: 'app-user-teams',
  templateUrl: './user-teams.component.html',
  styleUrl: './user-teams.component.scss'
})
export class UserTeamsComponent 
{
  searchVisible: boolean = false;

  toggleSearch()
  {
    this.searchVisible = !this.searchVisible;
  }
}
