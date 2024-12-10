import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { Gen9IconColors, Gen9IconColorsDark, Gen9IconColorsLight, StatColor, StatColorDark } from '../../../features/pokemon/models/pokemonColors';
import { tagBackgroundColors, tagTextColors } from '../models/tagColors.model';
import { Theme, themeProperties, themes } from '../models/theme.model';
import { configActions } from '../store/config.actions';
import { selectTheme } from '../store/config.selectors';

@Injectable({
  providedIn: 'root'
})

export class ThemeService 
{
  store = inject(Store);
  selectedTheme$: Observable<string> = this.store.select(selectTheme);
  selectedTheme?: Theme;

  constructor()
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

  getTagTextColor(backgroundColor: string): string
  {
    if(tagTextColors[tagBackgroundColors.indexOf(backgroundColor)])
    {
      return themes[1].colors['--text-color'];
    }
    else
    {
      return themes[0].colors['--text-color'];
    }
  }

  getTypeColor(name?: string)
  {
    return name ? Gen9IconColors[name.toLowerCase()] : "";  
  }

  getMoveColor(name?: string)
  {
    if(this.selectedTheme?.name === "light")
    {
      return name ? Gen9IconColorsLight[name.toLowerCase()] : "";

    }
    else
    {
      return name ? Gen9IconColorsDark[name.toLowerCase()] : "";
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