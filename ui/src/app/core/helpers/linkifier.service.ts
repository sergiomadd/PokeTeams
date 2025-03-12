import { Injectable } from '@angular/core';
import { ProcessedString } from '../models/misc/processedString.model';

@Injectable({
  providedIn: 'root'
})

export class LinkifierService
{
  constructor() 
  {
  
  }

  linkifyProse(value: string | undefined) : ProcessedString[]
  {
    //Format: [name](path){type} -> [paralyzed](http//...){mechanic}
    let regex = new RegExp('\\[.+?}', 'gm');
    let processedString: ProcessedString[] = [];
    if(value)
    {
      //Trim line jumps and unnecessary white space
      value = value.replace(/(\r\n|\n|\r)/gm, "");
      let last = 0;
      let matches = value.matchAll(regex);
      for(let match of matches)
      {
        //Match structure -> <RegExpExecArray>
        //[0: value, groups: undefined, index: match's first character's index, input: original string]
        if(match)
        {
          let matchedString = match[0];
          let start = match.index ?? 0;
          let end = start + matchedString.length;
          processedString.push(
            {
              type: "text",
              value: value.slice(last, start)
            }
          )
          let name: string = matchedString.split('[')[1]?.split(']')[0];
          let link: string = matchedString.split('(')[1]?.split(')')[0];
          let category: string = matchedString.split('{')[1]?.split('}')[0];
          processedString.push(
            {
              type: category === "type" ? "img" : "link",
              path: link ?? name,
              value: name
            }
          )
          last = end;
        }
      }
      processedString.push(
        {
          type: "text",
          value: value.slice(last, value.length)
        }
      )
    }
    return processedString;
  }
}
