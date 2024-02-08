import { EditorOptions } from "./editorOptions.model";
import { Pokemon } from "./pokemon/pokemon.model";

export interface Team
{
  id: string,
  pokemons: Pokemon[],
  options: EditorOptions,
  player?: string,
  tournament?: string,
  regulation?: string,
  viewCount: number,
  date?: string,
  visibility: boolean
}
