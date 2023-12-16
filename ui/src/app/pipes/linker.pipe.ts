import { Pipe, PipeTransform, Sanitizer, SecurityContext } from '@angular/core';

@Pipe({
  name: 'linker'
})

export class LinkerPipe implements PipeTransform {

  constructor(private sanitizer: Sanitizer) {}

  transform(value: string, regex): any 
  {
    return this.sanitize(this.replace(value, regex));
  }

  replace(str, regex) 
  {
    return str.replace(new RegExp(`(${regex})`, 'gi'), '<b>$1</b>');
  }

  sanitize(value: string) 
  {
    return this.sanitizer.sanitize(SecurityContext.HTML, value);
  }
}