import { Pipe, PipeTransform } from "@angular/core";
import { Pokemon } from "../../../core/models/pokemon/pokemon.model";
import { TeamOptions } from "../../../core/models/team/teamOptions.model";

@Pipe({
    name: 'getPokemonStatBorderRadiusPipe',
    pure: true
})

export class GetPokemonStatBorderRadiusPipe implements PipeTransform
{
  transform(pokemon: Pokemon, i: number, type: string, teamOptions?: TeamOptions, ): string
  {
    const ivs = pokemon?.ivs?.[i]?.value ?? 0;
    const evs = pokemon?.evs?.[i]?.value ?? 0;
  
    const showIVs = teamOptions?.showIVs && ivs / 4 !== 0;
    const showEVs = teamOptions?.showEVs && evs / 4 !== 0;

    if(type === "iv")
    {
      return showEVs  ? '0' : '0 15px 15px 0';
    }
    if(type === "base")
    {
      return (showIVs || showEVs) ? '15px 0 0 15px' : '15px';
    }
    return "";
  }
}