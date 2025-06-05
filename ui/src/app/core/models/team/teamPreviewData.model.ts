import { UserPreview } from "src/app/core/models/team/userPreview.model";
import { Regulation } from "./regulation.model";
import { Tag } from "./tag.model";
import { TeamOptions } from "./teamOptions.model";
import { Tournament } from "./tournament.model";

export interface TeamPreviewData
{
  id: string,
  pokemonIDs: number[],
  options: TeamOptions,
  player?: UserPreview,
  user?: UserPreview,
  tournament?: Tournament,
  regulation?: Regulation,
  viewCount: number,
  date?: string,
  visibility: boolean,
  tags?: Tag[]
}