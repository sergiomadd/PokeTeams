import { LocalizedText } from "src/app/shared/models/localizedText.model";
import { defaultStat, Stat } from "./stat.model";

export interface Nature
{
  name: LocalizedText,
  increasedStat: Stat,
  decreasedStat: Stat
}

export const defaultNature: Nature = 
{
  name: 
  {
    content: "Not Found",
    language: "en"
  },
  increasedStat: defaultStat,
  decreasedStat: defaultStat
}