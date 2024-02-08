import { Types } from "../pokemon/types.model"
import { Stat } from "../pokemon/stat.model"
import { Sprite } from "../pokemon/sprite.model"
import { Pokemon } from "../pokemon/pokemon.model"

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