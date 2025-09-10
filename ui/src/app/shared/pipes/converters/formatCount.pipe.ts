import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'formatCount'})

export class FormatCountPipe implements PipeTransform
{
  transform(count: number) : string
  {
    let formated: string = count.toString();
    let rounded: number = count;
    let letter: string = "";
    const decimals: number = 2;
    if(count >= 1e3) 
    {
      letter = 'K'
      rounded = count / 1e3
      formated = rounded.toFixed(decimals)
    }
    formated = formated + letter;
    return formated;
  }
}