import { Pipe, PipeTransform } from "@angular/core";
import { StatColor, StatColorDark } from "src/app/core/models/misc/colors";

@Pipe({
    name: 'getStatColor',
    standalone: false
})

export class GetStatColorPipe implements PipeTransform 
{
  transform(identifier?: string, selectedThemeName?: string): string 
  {
    if(selectedThemeName === "light")
    {
      return identifier ? StatColor[identifier] : "";
    }
    else
    {
      return identifier ? StatColorDark[identifier] : "";
    }
  }
}