import { defaultEffectiveness, Effectiveness } from "./effectiveness.model";

export interface Type
{
  identifier: string,
  name: string,
  iconPath: string,
  effectivenessAttack: Effectiveness,
  effectivenessDefense: Effectiveness
}

export const defaultType: Type = 
{
  identifier: "error",
  name: "Not Found",
  iconPath: "assets/error.png",
  effectivenessAttack: defaultEffectiveness,
  effectivenessDefense: defaultEffectiveness
}