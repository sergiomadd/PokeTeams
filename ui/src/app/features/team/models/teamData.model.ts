import { UserPreview } from "../../user/models/userPreview.model";
import { Regulation } from "./regulation.model";
import { Tag } from "./tag.model";
import { TeamOptions } from "./teamOptions.model";
import { Tournament } from "./tournament.model";

export interface TeamData
{
  id: string,
  pokemonIDs: number[],
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