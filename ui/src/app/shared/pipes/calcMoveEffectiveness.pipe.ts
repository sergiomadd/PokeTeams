import { Pipe, PipeTransform } from "@angular/core";
import { Effectiveness } from "src/app/core/models/pokemon/effectiveness.model";
import { Move } from "src/app/core/models/pokemon/move.model";

@Pipe(
  {
    name: 'calcMoveEffectivenessPipe',
    pure: true
  }
)

//Rename to calculate effectiveness
export class CalcMoveEffectivenessPipe implements PipeTransform
{
  transform(effectiveness?: Effectiveness, move?: Move): number | undefined
  {
    if(effectiveness && move?.pokeType)
    {
      if(effectiveness.doubleSuperEffective?.some(t => t.identifier === move?.pokeType?.identifier))
      {
        return 4;
      }
      else if(effectiveness.superEffective?.some(t => t.identifier === move?.pokeType?.identifier))
      {
        return 2;
      }
      else if(effectiveness.notVeryEffective?.some(t => t.identifier === move?.pokeType?.identifier))
      {
        return 0.5;
      }
      else if(effectiveness.doubleNotVeryEffective?.some(t => t.identifier === move?.pokeType?.identifier))
      {
        return 0.25;
      }
      else if(effectiveness.doubleNotVeryEffective?.some(t => t.identifier === move?.pokeType?.identifier))
      {
        return 0;
      }
    }
    return undefined;
  }
}