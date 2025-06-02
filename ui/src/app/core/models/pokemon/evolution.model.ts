import { LocalizedText } from "../misc/localizedText.model"
import { PokemonForm } from "./pokemonForm.model"
import { Sprite } from "./sprite.model"
import { defaultTypes, Types } from "./types.model"

export interface Evolution
{
  name?: LocalizedText,
  dexNumber?: number,
  pokemonId?: number,
  preEvolution?: Evolution,
	evolutions: Evolution[],
  forms?: PokemonForm[],
  types?: Types,
  sprite?: Sprite
}

export const defaultEvolution: Evolution =
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
  forms: undefined,
  types: defaultTypes,
  sprite: undefined
}