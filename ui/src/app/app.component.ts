import { Component, inject, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuComponent } from './components/menu/menu.component';
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

  @ViewChild(MenuComponent) menu?: MenuComponent;

  constructor() 
  {

  }

  ngOnInit()
  {
    this.themes.changeTheme("light");
  }
}