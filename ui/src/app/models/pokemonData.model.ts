import { Types } from "./types.model"
import { Stat } from "./stat.model"
import { Sprite } from "./sprite.model"

export interface PokemonData
{
  name?: string,
  dexNumber?: number,
  types?: Types,
  stats?: Stat[],
  sprites?: Sprite[]
}