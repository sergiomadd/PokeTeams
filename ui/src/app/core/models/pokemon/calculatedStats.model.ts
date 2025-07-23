import { Stat } from "./stat.model";

export interface CalculatedStats
{
  base: Stat[],
  ivs: Stat[],
  evs: Stat[],
  natures: Stat[],
  total: Stat[]
} 