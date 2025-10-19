import { Pokemon } from "../pokemon/pokemon.model";
import { Regulation } from "./regulation.model";
import { Tag } from "./tag.model";
import { TeamOptions } from "./teamOptions.model";
import { Tournament } from "./tournament.model";
import { UserPreview } from "./userPreview.model";

export interface Team
{
  id: string,
  pokemons: (Pokemon | null | undefined)[],
  options: TeamOptions,
  player?: UserPreview,
  user?: UserPreview,
  title?: string,
  tournament?: Tournament,
  regulation?: Regulation,
  rentalCode?: string,
  viewCount: number,
  date: string,
  visibility: boolean,
  tags?: Tag[]
}
