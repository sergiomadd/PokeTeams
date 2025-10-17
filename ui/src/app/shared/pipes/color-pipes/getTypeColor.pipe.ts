import { Pipe, PipeTransform } from '@angular/core';
import { Gen9TypeColors } from 'src/app/core/models/misc/colors';

@Pipe({
    name: 'getTypeColor',
    standalone: false
})
export class GetTypeColorPipe implements PipeTransform 
{
  transform(identifier?: string): string 
  {
    return identifier ? Gen9TypeColors[identifier] : ""; 
  }
}