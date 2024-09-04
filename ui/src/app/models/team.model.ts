import { Pokemon } from "./pokemon/pokemon.model";
import { Regulation } from "./regulation.model";
import { Tag } from "./tag.model";
import { TeamOptions } from "./teamOptions.model";
import { Tournament } from "./tournament.model";

export interface Team
{
  id: string,
  pokemons: Pokemon[],
  options: TeamOptions,
  player?: string,
  tournament?: Tournament,
  regulation?: Regulation,
  viewCount: number,
  date?: string,
  visibility: boolean,
  tags?: Tag[]
}
