import { LocalizedText } from "../misc/localizedText.model"

export interface Nature
{
  name: LocalizedText,
  increasedStatIdentifier: string,
  decreasedStatIdentifier: string
}

export const defaultNature: Nature = 
{
  name: 
  {
    content: "Not Found",
    language: "en"
  },
  increasedStatIdentifier: "",
  decreasedStatIdentifier: ""
}