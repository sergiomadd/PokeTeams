import { PokemonPreview } from "../pokemon/pokemonPreview.model";
import { TeamPreviewData } from "./teamPreviewData.model";

export interface TeamPreviewToCompare
{
  teamData: TeamPreviewData,
  pokemonPreviews: PokemonPreview[]
}