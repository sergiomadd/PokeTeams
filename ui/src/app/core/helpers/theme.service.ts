import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { Theme, themeProperties, themes } from '../models/misc/theme.model';
import { configActions } from '../store/config/config.actions';
import { selectTheme } from '../store/config/config.selectors';


@Injectable({
  providedIn: 'root'
})

export class ThemeService 
{
  store = inject(Store);
  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  selectedTheme?: Theme;
  selectedThemeName?: string;

  constructor()
  {
    if(this.selectedTheme$)
    {
      this.selectedTheme$.subscribe((value) =>
      {
        this.selectedThemeName = value;
        if(value)
        {
          this.selectedTheme = this.getTheme(value);
          if(this.selectedTheme)
          {
            this.applyTheme(this.selectedTheme);
          }
        }
      })
    }

  }

  getTheme(themeName: string) : Theme | undefined
  {
    return themes.find(t => t.name === themeName);
  }

  tryGetTheme(themeName: string) : Observable<Theme>
  {
    const gotTheme = this.getTheme(themeName);
    if(gotTheme)
    {
      return of(gotTheme);
    }
    return throwError(() => new Error("Error: theme not found"));
  }

  //Modify to toggleTheme(themeName: string)
  //if >2 themes added
  toggleTheme()
  {
    if(this.selectedTheme && this.selectedTheme.name === "light")
    {
      this.store.dispatch(configActions.toggleTheme({request: "dark"}))
    }
    else
    {
      this.store.dispatch(configActions.toggleTheme({request: "light"}))
    }
  }

  applyTheme(theme: Theme)
  {
    themeProperties.forEach(property => 
      {
        document.documentElement.style.setProperty(property, theme.colors[property]);
      })
  }
}