import { LocalizedText } from "../misc/localizedText.model"

export interface Stat
{
  identifier: string,
  name: LocalizedText,
  value: number
}

export const defaultStat: Stat = 
{
  identifier: "error",
  name: 
  {
    content: "",
    language: "en"
  },
  value: 0
}