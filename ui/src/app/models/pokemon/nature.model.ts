import { Stat } from "./stat.model";

export interface Nature
{
  name: string,
  increasedStat: Stat,
  decreasedStat: Stat
}