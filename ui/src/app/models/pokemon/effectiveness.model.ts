import { TypeWithEffectiveness } from "./typewitheffectiveness.model";

export interface Effectiveness
{
  doubleSuperEffective?: TypeWithEffectiveness[],
  superEffective?: TypeWithEffectiveness[],
  notVeryEffective?: TypeWithEffectiveness[],
  doubleNotVeryEffective?: TypeWithEffectiveness[],
  inmune?: TypeWithEffectiveness[]
}

export const defaultEffectiveness: Effectiveness = 
{
  doubleSuperEffective: [],
  superEffective: [],
  notVeryEffective: [],
  doubleNotVeryEffective: [],
  inmune: []
}