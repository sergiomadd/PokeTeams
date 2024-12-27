import { TeamPreviewData } from "../../team/models/teamPreviewData.model";

export interface SearchQueryResponseDTO
{
  teams: TeamPreviewData[],
  totalTeams: number
}