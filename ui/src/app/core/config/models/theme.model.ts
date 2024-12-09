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