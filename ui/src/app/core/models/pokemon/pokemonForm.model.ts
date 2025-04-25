import { LocalizedText } from "../misc/localizedText.model"
import { Sprite } from "./sprite.model"
import { Types, defaultTypes } from "./types.model"

export interface PokemonForm
{
  name?: LocalizedText,
  dexNumber?: number,
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
  dexNumber: 0,
  types: defaultTypes,
  sprite: undefined
}