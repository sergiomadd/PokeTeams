import { Component, inject } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent 
{
  themes = inject(ThemeService)

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
