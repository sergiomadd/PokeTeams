import { LocalizedText } from "src/app/shared/models/localizedText.model"
import { Pokemon } from "./pokemon.model"
import { Sprite } from "./sprite.model"
import { Stat } from "./stat.model"
import { defaultTypesWithEffectiveness, TypesWithEffectiveness } from "./typeswitheffectiveness.model"

export interface PokemonData
{
  name?: LocalizedText,
  dexNumber?: number,
  preEvolution?: Pokemon,
	evolutions: Pokemon[],
  types?: TypesWithEffectiveness,
  stats: Stat[],
  sprite?: Sprite
}

export const defaultPokemonData: PokemonData =
{
  name: 
  {
    content: "Not Found",
    language: "en"
  },
  dexNumber: 0,
  preEvolution: undefined,
	evolutions: [],
  types: defaultTypesWithEffectiveness,
  stats: [],
  sprite: undefined
}