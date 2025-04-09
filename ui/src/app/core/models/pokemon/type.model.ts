import { LocalizedText } from "../misc/localizedText.model"

export interface Type
{
  identifier: string,
  name: LocalizedText,
  iconPath: string
}

export const defaultType: Type = 
{
  identifier: "error",
  name:
  {
    content: "Not Found",
    language: "en"
  },
  iconPath: ""
}