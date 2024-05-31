import { TeamPreview } from "../teamPreview.model";

export interface SearchQueryResponseDTO
{
  teams: TeamPreview[],
  totalTeams: number
}