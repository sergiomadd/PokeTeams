import { TeamPreviewData } from "src/app/core/models/team/teamPreviewData.model";

export interface SearchQueryResponseDTO
{
  teams: TeamPreviewData[],
  totalTeams: number
}