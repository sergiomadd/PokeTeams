import { Pipe, PipeTransform } from "@angular/core";
import { TeamOptions } from "src/app/core/models/team/teamOptions.model";

@Pipe(
  {
    name: 'getPokemonStatSizePipe',
    pure: true,
    standalone: false
}
)

export class GetPokemonStatSizePipe implements PipeTransform
{
  transform(value?: number, teamOptions?: TeamOptions): string
  {
    if(value && teamOptions)
    {
      let maxValue: number = teamOptions && teamOptions?.maxStat > 0 
      ? teamOptions?.maxStat : 700; //the maximun stat value of any pokemons
      return `${value / maxValue * 100}%`;
    }
    return "0";
  }
}