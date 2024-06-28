import { Pokemon } from "../pokemon/pokemon.model"
import { Sprite } from "../pokemon/sprite.model"
import { Stat } from "../pokemon/stat.model"
import { defaultTypesWithEffectiveness, TypesWithEffectiveness } from "../pokemon/typeswitheffectiveness.model"

export interface PokemonData
{
  name?: string,
  dexNumber?: number,
  preEvolution?: Pokemon,
	evolutions?: Pokemon[],
  types?: TypesWithEffectiveness,
  stats?: Stat[],
  sprite?: Sprite
}

export const defaultPokemonData: PokemonData =
{
  name: "Not Found",
  dexNumber: 0,
  preEvolution: undefined,
	evolutions: [],
  types: defaultTypesWithEffectiveness,
  stats: [],
  sprite: undefined
}