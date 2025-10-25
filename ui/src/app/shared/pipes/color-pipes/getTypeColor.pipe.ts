import { Pipe, PipeTransform } from '@angular/core';
import { Gen9TypeColors } from '../../../core/models/misc/colors';

@Pipe({ name: 'getTypeColor' })
export class GetTypeColorPipe implements PipeTransform 
{
  transform(identifier?: string): string 
  {
    return identifier ? Gen9TypeColors[identifier] : ""; 
  }
}