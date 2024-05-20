import { EditorOptions } from "./editorOptions.model";
import { PokemonPreview } from "./pokemonPreview.model";
import { Tag } from "./tag.model";

export interface TeamPreview
{
  id: string,
  pokemons: PokemonPreview[],
  options: EditorOptions,
  player?: string,
  tournament?: string,
  regulation?: string,
  viewCount: number,
  date?: string,
  visibility: boolean,
  tags?: Tag[]
}