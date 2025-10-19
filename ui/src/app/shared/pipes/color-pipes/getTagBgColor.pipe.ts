import { Pipe, PipeTransform } from "@angular/core";
import { tagBackgroundColors } from "../../../core/models/misc/tagColors.model";

@Pipe({
    name: 'getTagBgColor',
    standalone: false
})

export class GetTagBgColorPipe implements PipeTransform 
{
  transform(color: number | string): string 
  {
    if(typeof color === "string")
    {
      color = +color;
    }
    return tagBackgroundColors[color];
  }
}