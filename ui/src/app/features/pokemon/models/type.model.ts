import { LocalizedText } from "src/app/shared/models/localizedText.model"

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
  iconPath: "assets/error.png"
}