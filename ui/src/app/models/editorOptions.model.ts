import { EditorOption } from "./editorOption.model";

export interface EditorOptions
{
  //left
  shinyPath: EditorOption,
  gender: boolean,
  genderPath: EditorOption,
  //top
  pokemonSpritesGen: EditorOption,
  typeIconsGen: string,
  //theme: string
  //right
  showIVs: boolean,
  showEVs: boolean,
  showNature: boolean,
  showLevel: boolean,
  showDexNumber: boolean,
  showNickname: boolean
  //---
  //lang?
  //display short effect or long effect?
}