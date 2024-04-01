import { Pokemon } from "../pokemon/pokemon.model"
import { Sprite } from "../pokemon/sprite.model"
import { Stat } from "../pokemon/stat.model"
import { defaultTypes, Types } from "../pokemon/types.model"

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

export const defaultPokemonData: PokemonData =
{
  name: "Not Found",
  dexNumber: 0,
  preEvolution: undefined,
	evolutions: [],
  types: defaultTypes,
  stats: [],
  sprites: undefined
}