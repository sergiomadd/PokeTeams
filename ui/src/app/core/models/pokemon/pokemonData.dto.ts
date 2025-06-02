import { LocalizedText } from "../misc/localizedText.model"
import { Evolution } from "./evolution.model"
import { PokemonForm } from "./pokemonForm.model"
import { Sprite } from "./sprite.model"
import { Stat } from "./stat.model"
import { defaultTypesWithEffectiveness, TypesWithEffectiveness } from "./typeswitheffectiveness.model"

export interface PokemonData
{
  name?: LocalizedText,
  dexNumber?: number,
  pokemonId?: number,
  preEvolution?: Evolution,
	evolutions: Evolution[],
  formId?: number,
  forms?: PokemonForm[],
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
  dexNumber: undefined,
  pokemonId: undefined,
  preEvolution: undefined,
	evolutions: [],
  formId: undefined,
  forms: [],
  types: defaultTypesWithEffectiveness,
  stats: [],
  sprite: undefined
}