import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})

export class LinkifierService
{
  path: string = "https://bulbapedia.bulbagarden.net/wiki/Water_Absorb_(Ability)";

  constructor(private sanitizer: DomSanitizer) 
  {

  }

  ngOnInit(){
    console.log('hello component initialized');
  }

  linkifyProse(value: string | undefined): string
  {
    let regex = new RegExp('(\\[.+?})', 'gm');
    return value ? this.sanitize(this.replaceProse(value, regex)) : '';
  }

  replaceProse(value: string, regex) : string
  {
    let formatedValue = value;
    let matches = value.match(regex);
    matches ? matches.forEach(match => 
    {
      let link: string = match.split('[')[1].split(']')[0];
      let category: string = match.split('{')[1].split(':')[0];
      let name: string = match.split('{')[1].split(':')[1].split('}')[0];
      if(link === "") { formatedValue = formatedValue.replace(match, name); }
      else if(category === "type") {formatedValue = formatedValue.replace(match, this.createImage(name, link, name));}
      else { formatedValue = formatedValue.replace(match, this.createLink(name, link)); }
    }) : null;
    return formatedValue;
  }

  createLink(value: string, path: string) 
  {
    return value.replace(value, `<a href="${path}" class="link">${value}</a>`);
  }

  createImage(value: string, path: string, name: string) 
  {
    return value.replace(value, `<img src="${path}" class="icon"></img> ${name}`);
  }

  sanitize(value: string) : string
  {
    return this.sanitizer.sanitize(SecurityContext.HTML, value) ?? '';
  }
}
