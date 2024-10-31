import { TeamPreview } from "../../team/models/teamPreview.model";

export interface SearchQueryResponseDTO
{
  teams: TeamPreview[],
  totalTeams: number
}