import { EditorOption } from "./editorOption.model";
import { Sprite } from "./pokemon/sprite.model";

export interface EditorData
{
  shinyPaths: EditorOption[],
  malePaths: EditorOption[],
  femalePaths: EditorOption[],
  pokemonSpritesPaths: Sprite[],
  typeIconPaths: EditorOption[],
}

export const defaultEditorData: EditorData = 
{
  shinyPaths: [],
  malePaths: [],
  femalePaths: [],
  pokemonSpritesPaths: [],
  typeIconPaths: [],
}