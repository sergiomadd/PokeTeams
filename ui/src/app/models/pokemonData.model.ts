import { Type } from "./type.model"
import { Stat } from "./stat.model"
import { Sprites } from "./sprites.model"

export interface PokemonData
{
  name: string,
  dexNumber: number,
  types: Type[],
  stats: Stat[],
  sprites: Sprites
}