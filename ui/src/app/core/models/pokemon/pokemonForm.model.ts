import { LocalizedText } from "../misc/localizedText.model"
import { Sprite } from "./sprite.model"
import { Types, defaultTypes } from "./types.model"

export interface PokemonForm
{
  name?: LocalizedText,
  dexNumber?: number,
  pokemonId?: number,
  formId?: string,
  types?: Types,
  sprite?: Sprite
}

export const defaultPokemonForm: PokemonForm =
{
  name: 
  {
    content: "Not Found",
    language: "en"
  },
  dexNumber: undefined,
  pokemonId: undefined,
  formId: undefined,
  types: defaultTypes,
  sprite: undefined
}