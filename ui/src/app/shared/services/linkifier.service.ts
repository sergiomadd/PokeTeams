import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LinkifierService
{
  constructor() 
  {

  }

  linkifyProse(value: string | undefined)
  {
    let regex = new RegExp('(\\[.+?})', 'gm');
    let processedString: any[] = [];
    if(value)
    {
      //Format: [name](path){type}
      let index: number = 0;
      let words: string[] = value.split(" ");
      let bufferArray: string[] = [];
      while(index < words.length)
      {
        if(words[index] && words[index].match(regex))
        {
          let word = words[index];
          let name: string = word.split('[')[1]?.split(']')[0] + word.split('}')[1];
          let link: string = word.split('(')[1]?.split(')')[0];
          let category: string = word.split('{')[1]?.split('}')[0];
          processedString.push(
            {
              type: "text",
              value: " " + bufferArray.join(" ") + " "
            }
          )
          processedString.push(
            {
              type: category === "type" ? "img" : "link",
              path: link ?? name,
              value: name
            }
          )
          bufferArray = [];
        }
        else
        {
          bufferArray.push(words[index]);
        }
        index++;
      }
      processedString.push(
        {
          type: "text",
          value: " " + bufferArray.join(" ") + " "
        }
      )
    }
    return processedString;
  }
}
