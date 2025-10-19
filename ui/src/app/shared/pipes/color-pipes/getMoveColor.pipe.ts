import { Pipe, PipeTransform } from "@angular/core";
import { Gen9TypeColorsDark, Gen9TypeColorsLight } from "../../../core/models/misc/colors";

@Pipe({ name: 'getMoveColor', standalone: false })

export class GetMoveColorPipe implements PipeTransform 
{
  transform(identifier?: string, selectedThemeName?: string): string 
  {
    if(selectedThemeName === "light")
    {
      return identifier ? Gen9TypeColorsLight[identifier] : "";
    }
    else
    {
      return identifier ? Gen9TypeColorsDark[identifier] : "";
    }
  }
}