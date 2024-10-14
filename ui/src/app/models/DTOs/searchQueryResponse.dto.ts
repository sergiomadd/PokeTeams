import { TeamPreview } from "../../features/team/models/teamPreview.model";

export interface SearchQueryResponseDTO
{
  teams: TeamPreview[],
  totalTeams: number
}