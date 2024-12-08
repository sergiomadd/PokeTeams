import { Pokemon } from "../../features/pokemon/models/pokemon.model"
import { Sprite } from "../../features/pokemon/models/sprite.model"
import { Stat } from "../../features/pokemon/models/stat.model"
import { defaultTypesWithEffectiveness, TypesWithEffectiveness } from "../../features/pokemon/models/typeswitheffectiveness.model"

export interface PokemonData
{
  name?: string,
  dexNumber?: number,
  preEvolution?: Pokemon,
	evolutions: Pokemon[],
  types?: TypesWithEffectiveness,
  stats: Stat[],
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