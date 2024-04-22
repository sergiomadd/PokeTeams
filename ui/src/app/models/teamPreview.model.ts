import { EditorOptions } from "./editorOptions.model";
import { Pokemon } from "./pokemon/pokemon.model";
import { Tag } from "./tag.model";

export interface TeamPreview
{
  id: string,
  pokemons: Pokemon[],
  options: EditorOptions,
  player?: string,
  tournament?: string,
  regulation?: string,
  viewCount: number,
  date?: string,
  visibility: boolean,
  tags?: Tag[]
}