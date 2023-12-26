import { EditorOptions } from "./editorOptions.model";
import { Pokemon } from "./pokemon.model";

export interface Team
{
  pokemons?: Pokemon[],
  options?: EditorOptions
}