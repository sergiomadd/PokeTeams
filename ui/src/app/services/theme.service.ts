import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Theme
{
  name: string,
  colors:
  {
    '--bg-color-1': string,
    '--bg-color-2': string,
    '--bg-color-3': string,
    '--bg-color-4': string,
    '--bg-color-5': string,
    '--text-color': string,
    '--text-color-contrast': string,
    '--text-color-highlight': string,
    '--text-color-link': string
  }
} 

@Injectable({
  providedIn: 'root'
})

export class ThemeService 
{
  properties: string[] = 
  ['--bg-color-1', '--bg-color-2', '--bg-color-3','--bg-color-4', '--bg-color-5',
  '--text-color', '--text-color-contrast', '--text-color-highlight', '--text-color-link']

  themes: Theme[] = 
  [
    {
      name: 'light',
      colors: 
      {
        '--bg-color-1': '#fafafa',
        '--bg-color-2': '#e4e5f1',
        '--bg-color-3': '#d2d3db',
        '--bg-color-4': '#9394a5',
        '--bg-color-5': '#484b6a',
        '--text-color': '#000000',
        '--text-color-contrast': '#ffffff',
        '--text-color-highlight': '#D5A100',
        '--text-color-link': '#0075BE'
      }
    },
    {
      name: 'dark',
      colors: 
      {
        '--bg-color-1': '#232B32',
        '--bg-color-2': '#0A2647',
        '--bg-color-3': '#144272',
        '--bg-color-4': '#2C74B3',
        '--bg-color-5': '#0075BE',
        '--text-color': '#d3d3d3',
        '--text-color-contrast': '#000000',
        '--text-color-highlight': '#D5A100',
        '--text-color-link': '#0075BE'
      }
    }
  ]

  selectedTheme$?: BehaviorSubject<Theme>;


  constructor() 
  {
    this.selectedTheme$ = new BehaviorSubject<Theme>(this.themes[0]);
  }

  changeTheme(themeName: string)
  {
    let theme: Theme = this.themes.find(t => t.name === themeName)!;
    this.selectedTheme$?.next(theme);
    this.properties.forEach(property => 
    {
      document.documentElement.style.setProperty(property, theme.colors[property]);
    })
  }

  switchThemes()
  {
    if(this.selectedTheme$?.getValue().name === "light")
    {
      this.changeTheme("dark");
    }
    else
    {
      this.changeTheme("light");
    }
  }
}