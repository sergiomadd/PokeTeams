import { UserPreview } from "src/app/features/user/models/userPreview.model";
import { PokemonPreview } from "../pokemon/pokemonPreview.model";
import { Regulation } from "./regulation.model";
import { Tag } from "./tag.model";
import { TeamOptions } from "./teamOptions.model";
import { Tournament } from "./tournament.model";

export interface TeamPreview
{
  id: string,
  pokemonIDs: PokemonPreview[],
  options: TeamOptions,
  player?: UserPreview,
  tournament?: Tournament,
  regulation?: Regulation,
  viewCount: number,
  date?: string,
  visibility: boolean,
  tags?: Tag[]
}