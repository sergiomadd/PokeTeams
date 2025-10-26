import { Pipe, PipeTransform } from "@angular/core";
import { Stat } from "../../../core/models/pokemon/stat.model";

@Pipe({ name: 'getStatCode' })

export class GetStatCodePipe implements PipeTransform 
{
  transform(stat: Stat): string 
  {
    const nameDict = 
    {
      "hp": "HP",
      "attack": "Atk",
      "defense": "Def",
      "special-attack": "SpA",
      "special-defense": "SpD",
      "speed": "Spe"
    }
    return nameDict[stat.identifier];
  }
}