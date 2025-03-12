import { UserPreview } from "src/app/features/user/models/userPreview.model";
import { Pokemon } from "../pokemon/pokemon.model";
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
  rentalCode?: string,
  viewCount: number,
  date: string,
  visibility: boolean,
  tags?: Tag[]
}
