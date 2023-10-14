import { Type } from "./type.model"
import { Stat } from "./stat.model"

export interface PokemonData
{
  name: string,
  dexNumber: number,
  types: Type[],
  stats: Stat[]
}