import { EditorOption } from "./editorOption.model";
import { Sprite } from "./pokemon/sprite.model";

export interface EditorData
{
  shinyPaths: EditorOption[],
  genderPaths: EditorOption[],
  pokemonSpritesPaths: Sprite[],
  typeIconPaths: EditorOption[],
}