import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TeamService } from './features/team/services/team.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent 
{
  title = 'ui';
  store = inject(Store);
  teamService = inject(TeamService);

  menuOpen: boolean = false;

  constructor() 
  {

  }

  toggleMenu()
  {
    this.menuOpen = !this.menuOpen;
  }
}