import { Effectiveness } from "./effectiveness.model";

export interface Type
{
  identifier: string,
  name: string,
  iconPath: string,
  effectivenessAttack: Effectiveness,
  effectivenessDefense: Effectiveness
}