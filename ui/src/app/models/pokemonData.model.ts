import { Types } from "./types.model"
import { Stat } from "./stat.model"
import { Sprite } from "./sprite.model"
import { Pokemon } from "./pokemon.model"

export interface PokemonData
{
  name?: string,
  dexNumber?: number,
  preEvolution?: Pokemon,
	evolutions?: Pokemon[],
  types?: Types,
  stats?: Stat[],
  sprites?: Sprite[]
}