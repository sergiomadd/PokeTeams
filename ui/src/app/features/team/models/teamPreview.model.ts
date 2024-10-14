import { PokemonPreview } from "../../pokemon/models/pokemonPreview.model";
import { UserPreview } from "../../user/models/userPreview.model";
import { Regulation } from "./regulation.model";
import { Tag } from "./tag.model";
import { TeamOptions } from "./teamOptions.model";
import { Tournament } from "./tournament.model";

export interface TeamPreview
{
  id: string,
  pokemons: PokemonPreview[],
  options: TeamOptions,
  player?: UserPreview,
  tournament?: Tournament,
  regulation?: Regulation,
  viewCount: number,
  date?: string,
  visibility: boolean,
  tags?: Tag[]
}