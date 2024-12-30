import { Pokemon } from "../../pokemon/models/pokemon.model";
import { UserPreview } from "../../user/models/userPreview.model";
import { Regulation } from "./regulation.model";
import { Tag } from "./tag.model";
import { TeamOptions } from "./teamOptions.model";
import { Tournament } from "./tournament.model";

export interface Team
{
  id: string,
  pokemons: (Pokemon | null | undefined)[],
  options: TeamOptions,
  player?: UserPreview,
  tournament?: Tournament,
  regulation?: Regulation,
  viewCount: number,
  date: string,
  visibility: boolean,
  tags?: Tag[]
}
