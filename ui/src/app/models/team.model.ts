import { EditorOptions } from "./editorOptions.model";
import { Pokemon } from "./pokemon.model";

export interface Team
{
  id: string,
  pokemons: Pokemon[],
  options: EditorOptions,
  player?: string | null,
}
