import { EditorOption } from "./editorOption.model";

export interface EditorOptions
{
  //left
  pokemonSpritesGen: EditorOption,
  typeIconsGen: string,
  shinyPath: EditorOption,
  gender: boolean,
  genderPath: EditorOption,
  //theme: string
  //right
  showIVs: boolean,
  showEVs: boolean,
  showNature: boolean,
  showDexNumber: boolean,
  showNickname: boolean,
  //showTeratype
  //---
  //lang?
  //display short effect or long effect?
  //misc
  maxLevel: number
}