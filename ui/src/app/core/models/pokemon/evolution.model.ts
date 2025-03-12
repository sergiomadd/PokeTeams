import { LocalizedText } from "../misc/localizedText.model"
import { Sprite } from "./sprite.model"
import { defaultTypes, Types } from "./types.model"

export interface Evolution
{
  name?: LocalizedText,
  dexNumber?: number,
  preEvolution?: Evolution,
	evolutions: Evolution[],
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
  dexNumber: 0,
  preEvolution: undefined,
	evolutions: [],
  types: defaultTypes,
  sprite: undefined
}