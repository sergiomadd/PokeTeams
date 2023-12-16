import { Injectable, Sanitizer, SecurityContext} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LinkifierService 
{

  path: string = "https://bulbapedia.bulbagarden.net/wiki/Water_Absorb_(Ability)"
  /*
  solucion final:
  enviar del back [url]{move:hidden-power}
  y luego desde el front:
  - si contains type -> coger tambn icono -> en link enviar icono
  - si contains item -> coger tambn icono

  la option de enviar todo el obj type no es buena, por que estarias
  haciendo get request todo el rato cada vez que se hover en ability

  que pasa en otros idiomas? -> tendria que pillar el name
  SOLUCION = pillar el name igualmente desde el back y enviar:
  [URL]{move:NAME.tolower()}
  */

  constructor(private sanitizer: Sanitizer) { }

  transform(value: string, regex, path: string): any 
  {
    return this.sanitize(this.replace(value, regex));
  }

  sanitize(value: string) 
  {
    return this.sanitizer.sanitize(SecurityContext.HTML, value);
  }

  replace(value: string, regex) 
  {
    let formatedValue = value;
    let matches = value.match(regex);
    matches ? matches.forEach(match => 
    {
      console.log(match)
      let link: string = match.split('[')[1].split(']')[0];
      let category: string = match.split('{')[1].split(':')[0];
      let name: string = match.split('{')[1].split(':')[1].split('}')[0];
      if(category === "type") {formatedValue = formatedValue.replace(match, this.createImage(name, link));}
      else { formatedValue = formatedValue.replace(match, this.createLink(name, link)); }
    }) : null;
    return formatedValue;
  }

  createLink(value: string, path: string) 
  {
    return value.replace(value, `<a href="${path}">${value}</a>`);
  }

  createImage(value: string, path: string) 
  {
    return value.replace(value, `<img src="${path}" class="icon"></img>`);
  }

  linkify(value: string | undefined): string
  {
    //"/(\[.+?})/gm"
    console.log("linkifygbn")
    let regex = new RegExp('(\\[.+?})', 'gm');
    return value ? this.replace(value, regex) : '';
  }

}
