import { Pokemon } from "./pokemon/pokemon.model";
import { Tag } from "./tag.model";
import { TeamOptions } from "./teamOptions.model";

export interface Team
{
  id: string,
  pokemons: Pokemon[],
  options: TeamOptions,
  player?: string,
  tournament?: string,
  regulation?: string,
  viewCount: number,
  date?: string,
  visibility: boolean,
  tags?: Tag[]
}
