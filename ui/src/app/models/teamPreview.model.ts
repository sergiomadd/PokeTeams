import { PokemonPreview } from "./pokemonPreview.model";
import { Tag } from "./tag.model";
import { TeamOptions } from "./teamOptions.model";

export interface TeamPreview
{
  id: string,
  pokemons: PokemonPreview[],
  options: TeamOptions,
  player?: string,
  tournament?: string,
  regulation?: string,
  viewCount: number,
  date?: string,
  visibility: boolean,
  tags?: Tag[]
}