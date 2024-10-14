import { defaultEffectiveness, Effectiveness } from "./effectiveness.model";

export interface TypeWithEffectiveness
{
  identifier: string,
  name: string,
  iconPath: string,
  effectivenessAttack: Effectiveness,
  effectivenessDefense: Effectiveness
}

export const defaultTypeWithEffectiveness: TypeWithEffectiveness = 
{
  identifier: "error",
  name: "Not Found",
  iconPath: "assets/error.png",
  effectivenessAttack: defaultEffectiveness,
  effectivenessDefense: defaultEffectiveness
}