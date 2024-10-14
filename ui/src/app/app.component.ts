import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ThemeService } from './core/services/theme.service';
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
  themes = inject(ThemeService);

  menuOpen: boolean = true;

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