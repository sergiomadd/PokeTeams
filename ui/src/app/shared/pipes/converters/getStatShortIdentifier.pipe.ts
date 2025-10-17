import { Pipe, PipeTransform } from "@angular/core";
import { Stat } from "src/app/core/models/pokemon/stat.model";

@Pipe({
    name: 'getStatShortIdentifier',
    standalone: false
})

export class GetStatShortIdentifierPipe implements PipeTransform 
{
  transform(stat: Stat): string 
  {
    const nameDict = 
    {
      "hp": "hp",
      "attack": "atk",
      "defense": "def",
      "special-attack": "spa",
      "special-defense": "spd",
      "speed": "spe"
    }
    return nameDict[stat.identifier];
  }
}