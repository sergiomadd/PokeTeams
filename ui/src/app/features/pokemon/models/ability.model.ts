import { LocalizedText } from "src/app/shared/models/localizedText.model"

export interface Ability
{
  identifier: string,
  name: LocalizedText,
  prose: LocalizedText,
  hidden: boolean
}

export const defaultAbility: Ability = 
{
  identifier: "error",
  name: 
  {
    content: "Not Found",
    language: "en"
  },
  prose: 
  {
    content: "Not Found",
    language: "en"
  },
  hidden: false
}