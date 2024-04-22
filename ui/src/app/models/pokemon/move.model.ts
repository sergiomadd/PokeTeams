import { defaultTypeWithEffectiveness, TypeWithEffectiveness } from "./typewitheffectiveness.model"


export interface Move
{
  identifier: string,
  name: string,
  pokeType?: TypeWithEffectiveness,
  damageClass?: 
  {
    name: string,
    description: string,
    iconPath: string
  },
  power?: number,
  pp?: number,
  accuracy?: number,
  priority?: number,
  target?: 
  {
    name: string,
    description: string
  },
  effect?: 
  {
    short: string,
    long: string,
    chance?: number
  },
  meta?: 
  {
    minHits?: number,
    maxHits?: number,
    minTurns?: number,
    maxTurns?: number,
    drain?: number,
    healing?: number,
    critRate?: number,
    statusChance?: number,
    flinchChance?: number,
    statChange?:
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

export const defaultMove: Move = 
{
  identifier: "error",
  name: "Not Found",
  pokeType: defaultTypeWithEffectiveness,
  damageClass: 
  {
    name: "",
    description: "",
    iconPath: "assets/error.png"
  }
}