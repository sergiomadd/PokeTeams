import { LocalizedText } from "src/app/shared/models/localizedText.model";
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
  iconPath: "assets/error.png",
  effectivenessAttack: defaultEffectiveness,
  effectivenessDefense: defaultEffectiveness
}