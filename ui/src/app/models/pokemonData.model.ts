import { Type } from "./type.model"
import { Stat } from "./stat.model"
import { Sprite } from "./sprite.model"

export interface PokemonData
{
  name: string,
  dexNumber: number,
  types: Type[],
  stats: Stat[],
  sprites: Sprite[]
}