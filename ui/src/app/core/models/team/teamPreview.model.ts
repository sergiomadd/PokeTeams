import { PokemonPreview } from "../pokemon/pokemonPreview.model";
import { Regulation } from "./regulation.model";
import { Tag } from "./tag.model";
import { TeamOptions } from "./teamOptions.model";
import { Tournament } from "./tournament.model";
import { UserPreview } from "./userPreview.model";

export interface TeamPreview
{
  id: string,
  pokemonIDs: PokemonPreview[],
  options: TeamOptions,
  player?: UserPreview,
  user?: UserPreview,
  title?: string,
  tournament?: Tournament,
  regulation?: Regulation,
  viewCount: number,
  date?: string,
  visibility: boolean,
  tags?: Tag[]
}