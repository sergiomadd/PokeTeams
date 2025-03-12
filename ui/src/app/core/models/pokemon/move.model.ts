import { LocalizedText } from "../misc/localizedText.model"
import { defaultTypeWithEffectiveness, TypeWithEffectiveness } from "./typewitheffectiveness.model"

export interface Move
{
  identifier: string,
  name: LocalizedText,
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
    description: LocalizedText
  },
  effect?: 
  {
    short: LocalizedText,
    long: LocalizedText,
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
  name: 
  {
    content: "Not Found",
    language: "en"
  },
  pokeType: defaultTypeWithEffectiveness,
  damageClass: 
  {
    name: "",
    description: "",
    iconPath: "assets/error.png"
  }
}