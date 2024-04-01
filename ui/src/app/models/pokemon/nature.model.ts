import { defaultStat, Stat } from "./stat.model";

export interface Nature
{
  name: string,
  increasedStat: Stat,
  decreasedStat: Stat
}

export const defaultNature: Nature = 
{
  name: "Not Found",
  increasedStat: defaultStat,
  decreasedStat: defaultStat
}