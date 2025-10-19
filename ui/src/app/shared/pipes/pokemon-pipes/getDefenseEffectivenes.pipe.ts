import { Pipe, PipeTransform } from "@angular/core";
import { Effectiveness } from "../../../core/models/pokemon/effectiveness.model";
import { Pokemon } from "../../../core/models/pokemon/pokemon.model";

@Pipe(
  {
    name: 'getDefenseEffectivenessPipe',
    pure: true,
    standalone: false
}
)

//Rename to calculate effectiveness
export class GetDefenseEffectivenessPipe implements PipeTransform
{
  transform(pokemon: Pokemon | null | undefined, teraType: boolean = false): Effectiveness | undefined
  {
    if(teraType && pokemon?.teraType) { return pokemon.teraType.effectivenessDefense }
    if(pokemon?.types?.dualEffectiveness) { return pokemon?.types?.dualEffectiveness; }
    if(pokemon?.types?.type1?.effectivenessDefense) { return pokemon?.types?.type1?.effectivenessDefense; }
    return undefined;
  }
}