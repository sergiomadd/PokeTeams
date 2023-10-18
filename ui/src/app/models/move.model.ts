import { Type } from "./type.model"


export interface Move
{
  name: string,
  pokeType: Type,
  damageClass: 
  {
    name: string,
    description: string,
    iconPath: string
  },
  power: number,
  pp: number,
  accuracy: number,
  priority: number,
  target: 
  {
    name: string,
    description: string
  },
  effect: 
  {
    short: string,
    long: string,
    chance: number
  },
  meta: 
  {
    minHits: number,
    maxHits: number,
    minTurns: number,
    maxTurns: number,
    drain: number,
    healing: number,
    critRate: number,
    statusChance: number,
    flinchChance: number,
    statChange:
    {
      stat:
      {
        identifier: string,
        name: string,
        baseStat: number
      },
      change: number,
      changeChance: number
    }
  },
}