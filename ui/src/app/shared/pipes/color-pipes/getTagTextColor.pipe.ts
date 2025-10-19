import { Pipe, PipeTransform } from "@angular/core";
import { tagTextColors } from "../../../core/models/misc/tagColors.model";
import { themes } from "../../../core/models/misc/theme.model";


@Pipe({
    name: 'getTagTextColor',
    standalone: false
})

export class GetTagTextColorPipe implements PipeTransform 
{
  transform(color: number | string, selectedThemeName?: string): string 
  {
    if(typeof color === "string")
    {
      color = +color;
    }
    //Dark
    if(tagTextColors[color])
    {
      return selectedThemeName === themes[1].name ? themes[1].colors['--text-color'] : themes[1].colors['--white'];
    }
    //Light
    else
    {
      return themes[0].colors['--text-color'];
    }
  }
}