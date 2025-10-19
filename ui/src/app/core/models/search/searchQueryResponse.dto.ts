import { TeamPreviewData } from "../team/teamPreviewData.model";

export interface SearchQueryResponseDTO
{
  teams: TeamPreviewData[],
  totalTeams: number
}