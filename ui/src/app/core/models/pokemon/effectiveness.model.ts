import { Type } from "./type.model";

export interface Effectiveness
{
  doubleSuperEffective?: Type[],
  superEffective?: Type[],
  notVeryEffective?: Type[],
  doubleNotVeryEffective?: Type[],
  inmune?: Type[]
}

export const defaultEffectiveness: Effectiveness = 
{
  doubleSuperEffective: [],
  superEffective: [],
  notVeryEffective: [],
  doubleNotVeryEffective: [],
  inmune: []
}