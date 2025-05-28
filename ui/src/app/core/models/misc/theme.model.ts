export interface Theme
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
    '--primary': string,
    '--secondary': string,
    '--text-color': string,
    '--text-color-secondary': string,
    '--text-color-highlight': string,
    '--text-color-link': string,
    '--text-color-reverse': string,
    '--success': string,
    '--error': string,
    '--white': string,
    '--black': string
  }
}

export const themeProperties: string[] =
[ '--bg-color-1', '--bg-color-2', '--bg-color-3',
'--bg-color-reverse-1', '--bg-color-reverse-2', '--bg-color-reverse-3',
'--bg-color-tooltip',
'--primary', '--secondary',
'--text-color', '--text-color-secondary', '--text-color-highlight', '--text-color-link', '--text-color-reverse',
'--success', '--error', '--white', '--black'
]

export const themes: Theme[] = 
[
  {
    name: 'light',
    colors: 
    {
      '--bg-color-1': 'hsl(0, 0%, 100%)',
      '--bg-color-2': 'hsl(0, 0%, 95%)',
      '--bg-color-3': 'hsl(0, 0%, 85%)',
      '--bg-color-reverse-1': 'hsl(0, 0%, 15%)',
      '--bg-color-reverse-2': 'hsl(0, 0%, 20%)',
      '--bg-color-reverse-3': 'hsl(0, 0%, 25%)',
      '--bg-color-tooltip': 'hsla(0, 0%, 13%, 0.9)',
      '--primary': 'hsl(358, 77%, 52%)',
      '--secondary': 'hsl(202, 65%, 49%)',
      '--text-color': '#000000',
      '--text-color-secondary': '#888888',
      '--text-color-highlight': '#fdc800',
      '--text-color-link': '#0075BE',
      '--text-color-reverse': '#ffffff',
      '--success': 'hsl(140, 80%, 44%)',
      '--error': 'hsl(352, 80%, 51%)',
      '--white': '#ffffff',
      '--black': '#000000'
    }
  },
  {
    name: 'dark',
    colors: 
    {
      '--bg-color-1': 'hsl(0, 0%, 15%)',
      '--bg-color-2': 'hsl(0, 0%, 20%)',
      '--bg-color-3': 'hsl(0, 0%, 25%)',
      '--bg-color-reverse-1': 'hsl(0, 0%, 100%)',
      '--bg-color-reverse-2': 'hsl(0, 0%, 95%)',
      '--bg-color-reverse-3': 'hsl(0, 0%, 85%)',
      '--bg-color-tooltip': 'hsla(0, 0%, 86%, 0.9)',
      '--primary': 'hsl(358, 77%, 42%)',
      '--secondary': 'hsl(202, 65%, 39%)',
      '--text-color': '#e1e1e1',
      '--text-color-secondary': '#9e9e9e',
      '--text-color-highlight': '#fdc800',
      '--text-color-link': '#0075BE',
      '--text-color-reverse': '#000000',
      '--success': 'hsl(140, 80%, 34%)',
      '--error': 'hsl(352, 80%, 41%)',
      '--white': '#ffffff',
      '--black': '#000000'
    }
  }
]