import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TeamService } from './services/team.service';
import { ThemeService } from './services/theme.service';

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
  themes = inject(ThemeService);

  menuOpen: boolean = false;

  constructor() 
  {

  }

  ngOnInit()
  {
    this.themes.changeTheme("light");
  }

  toggleMenu()
  {
    this.menuOpen = !this.menuOpen;
  }


}