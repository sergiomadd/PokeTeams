import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { Gen9IconColors, Gen9IconColorsDark, Gen9IconColorsLight, StatColor, StatColorDark } from '../models/misc/colors';
import { tagBackgroundColors, tagTextColors } from '../models/misc/tagColors.model';
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

  tagBackgroundColors = tagBackgroundColors;

  constructor()
  {
    if(this.selectedTheme$)
    {
      this.selectedTheme$.subscribe((value) =>
      {
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

  getTagBgColor(color: number | string): string
  {
    if(typeof color === "string")
    {
      color = +color;
    }
    return this.tagBackgroundColors[color];
  }

  getTagTextColor(color: number | string): string
  {
    if(typeof color === "string")
    {
      color = +color;
    }
    //Dark
    if(tagTextColors[color])
    {
      return this.selectedTheme?.name === themes[1].name ? themes[1].colors['--text-color'] : themes[1].colors['--white'];
    }
    //Light
    else
    {
      return themes[0].colors['--text-color'];
    }
  }

  getTypeColor(identifier?: string)
  {
    return identifier ? Gen9IconColors[identifier] : "";  
  }

  getMoveColor(identifier?: string)
  {
    if(this.selectedTheme?.name === "light")
    {
      return identifier ? Gen9IconColorsLight[identifier] : "";

    }
    else
    {
      return identifier ? Gen9IconColorsDark[identifier] : "";
    }
  }

  getStatColor(identifier: string)
  {
    if(this.selectedTheme?.name === "light")
    {
      return identifier ? StatColor[identifier] : "";
    }
    else
    {
      return identifier ? StatColorDark[identifier] : "";
    }
  }
}