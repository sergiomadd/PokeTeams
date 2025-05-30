import { LocalizedText } from "../misc/localizedText.model";
import { defaultEffectiveness, Effectiveness } from "./effectiveness.model";

export interface TypeWithEffectiveness
{
  identifier: string,
  name: LocalizedText,
  iconPath: string,
  effectivenessAttack: Effectiveness,
  effectivenessDefense: Effectiveness
}

export const defaultTypeWithEffectiveness: TypeWithEffectiveness = 
{
  identifier: "error",
  name: 
  {
    content: "Not Found",
    language: "en"
  },
  iconPath: "",
  effectivenessAttack: defaultEffectiveness,
  effectivenessDefense: defaultEffectiveness
}