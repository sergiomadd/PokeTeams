import { Component, inject } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent 
{
  themes = inject(ThemeService)

  title = 'ui';

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