import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Gen9IconColors, Gen9IconColorsDark, Gen9IconColorsLight, StatColor, StatColorDark } from '../../features/pokemon/models/pokemonColors';

interface Theme
{
  name: string,
  colors:
  {
    '--bg-color-1': string,
    '--bg-color-2': string,
    '--bg-color-3': string,
    '--bg-color-reverse-1': string,
    '--bg-color-reverse-2': string,
    '--bg-color-reverse-3': string,
    '--bg-color-tooltip': string,
    '--primary-light': string,
    '--primary': string,
    '--primary-dark': string,
    '--secondary-light': string,
    '--secondary': string,
    '--secondary-dark': string,
    '--tertiary-light': string,
    '--tertiary': string,
    '--tertiary-dark': string,
    '--text-color': string,
    '--text-color-secondary': string,
    '--text-color-highlight': string,
    '--text-color-link': string,
    '--text-color-reverse': string
  }
} 

@Injectable({
  providedIn: 'root'
})

export class ThemeService 
{
  properties: string[] = 
  [ '--bg-color-1', '--bg-color-2', '--bg-color-3',
    '--bg-color-reverse-1', '--bg-color-reverse-2', '--bg-color-reverse-3',
    '--bg-color-tooltip',
    '--primary', '--primary-light', '--primary-dark',
    '--secondary', '--secondary-light', '--secondary-dark',
    '--tertiary', '--tertiary-light', '--tertiary-dark',
    '--text-color', '--text-color-secondary', '--text-color-highlight', '--text-color-link', '--text-color-reverse'
  ]

  themes: Theme[] = 
  [
    {
      name: 'light',
      colors: 
      {
        '--bg-color-1': '#FFFFFF',
        '--bg-color-2': '#f2f2f2',
        '--bg-color-3': '#dbdbdb',
        '--bg-color-reverse-1': '#222222',
        '--bg-color-reverse-2': '#2c2c2c',
        '--bg-color-reverse-3': '#373737',
        '--bg-color-tooltip': 'hsla(0, 0%, 13%, 0.767)',
        '--primary-light': 'hsl(11, 30%, 70%)',
        '--primary': 'hsl(11, 90%, 45%)',
        '--primary-dark': 'hsl(11, 70%, 30%)',
        '--secondary-light': 'hsl(52, 30%, 70%)',
        '--secondary': 'hsl(52, 100%, 50%)',
        '--secondary-dark': 'hsl(52, 70%, 30%)',
        '--tertiary-light': 'hsl(209, 30%, 70%)',
        '--tertiary': 'hsl(209, 90%, 30%)',
        '--tertiary-dark': 'hsl(209, 70%, 30%)',
        '--text-color': '#000000',
        '--text-color-secondary': '#888888',
        '--text-color-highlight': '#fdc800',
        '--text-color-link': '#0075BE',
        '--text-color-reverse': '#e1e1e1'
      }
    },
    {
      name: 'dark',
      colors: 
      {
        '--bg-color-1': '#222222',
        '--bg-color-2': '#2c2c2c',
        '--bg-color-3': '#373737',
        '--bg-color-reverse-1': '#FFFFFF',
        '--bg-color-reverse-2': '#f2f2f2',
        '--bg-color-reverse-3': '#dbdbdb',
        '--bg-color-tooltip': 'hsla(0, 0%, 86%, 0.767)',
        '--primary-light': 'hsl(209, 63%, 45%)',
        '--primary': 'hsl(209, 63%, 45%)',
        '--primary-dark': 'hsl(209, 63%, 45%)',
        '--secondary-light': '#f37052',
        '--secondary': '#f37052',
        '--secondary-dark': '#f37052',
        '--tertiary-light': '#f37052',
        '--tertiary': '#f37052',
        '--tertiary-dark': '#f37052',
        '--text-color': '#e1e1e1',
        '--text-color-secondary': '#9e9e9e',
        '--text-color-highlight': '#fdc800',
        '--text-color-link': '#0075BE',
        '--text-color-reverse': '#000000'
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

  tagBackgroundColors: string[] = 
  [
    '#1f1723', '#3c2f52', '#8c7f90', '#bcb0b3',
    '#e2e2e2', '#d86830', '#f09548', '#efd081',
    '#b22741', '#f5464c', '#f79c88', '#4656a5',
    '#4995f3', '#72deeb', '#3ec54b', '#b4e656',
  ];

  //white -> true
  //black -> false
  tagTextColors: boolean[] = 
  [
    true, true, true, false,
    false, true, false, false,
    true,  true, false, true,
    true,  false, false, false,
  ];

  getTagTextColor(backgroundColor: string): string
  {
    if(this.tagTextColors[this.tagBackgroundColors.indexOf(backgroundColor)])
    {
      return this.themes[1].colors['--text-color'];
    }
    else
    {
      return this.themes[0].colors['--text-color'];
    }
  }

  getTypeColor(name?: string)
  {
    return name ? Gen9IconColors[name.toLowerCase()] : "";  
  }

  getMoveColor(name?: string)
  {
    if(this.selectedTheme$?.getValue().name === "light")
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
    if(this.selectedTheme$?.getValue().name === "light")
    {
      return identifier ? StatColor[identifier] : "";
    }
    else
    {
      return identifier ? StatColorDark[identifier] : "";
    }
  }
}