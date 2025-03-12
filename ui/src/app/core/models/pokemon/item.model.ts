import { LocalizedText } from "../misc/localizedText.model"

export interface Item
{
  identifier: string,
  name: LocalizedText,
  prose: LocalizedText,
  iconPath: string,
  language: string
}

export const DefaultItem: Item =
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
  iconPath: "assets/error.png",
  language: ""
}