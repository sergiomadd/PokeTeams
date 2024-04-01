import { defaultEffectiveness, Effectiveness } from "./effectiveness.model";
import { defaultType, Type } from "./type.model";

export interface Types
{
  dualEffectiveness?: Effectiveness,
  type1?: Type,
  type2?: Type
}

export const defaultTypes: Types = 
{
  dualEffectiveness: defaultEffectiveness,
  type1: defaultType,
  type2: defaultType
}