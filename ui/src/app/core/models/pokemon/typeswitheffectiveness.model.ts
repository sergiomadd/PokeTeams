import { defaultEffectiveness, Effectiveness } from "./effectiveness.model";
import { defaultTypeWithEffectiveness, TypeWithEffectiveness } from "./typewitheffectiveness.model";

export interface TypesWithEffectiveness
{
  dualEffectiveness?: Effectiveness,
  type1?: TypeWithEffectiveness,
  type2?: TypeWithEffectiveness
}

export const defaultTypesWithEffectiveness: TypesWithEffectiveness = 
{
  dualEffectiveness: defaultEffectiveness,
  type1: defaultTypeWithEffectiveness,
  type2: defaultTypeWithEffectiveness
}