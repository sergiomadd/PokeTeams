import { Component, inject } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent 
{
  themes = inject(ThemeService)

  title = 'ui';

  user: User | undefined = undefined;
  /*
  {
    name: "sergio",
    username: "sergiomadd",
    picture: "url",
    teams: []
  }*/

  ngOnInit()
  {
    this.themes.changeTheme("light");
  }

  checkEvent($event)
  {
    if($event)
    {
      this.themes.changeTheme("dark")
    }
    else
    {
      this.themes.changeTheme("light")
    }
  }


}