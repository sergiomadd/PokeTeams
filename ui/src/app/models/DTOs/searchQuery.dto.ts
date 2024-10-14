import { TeamSearchOrder } from "../../features/search/models/teamSearchOrder.enum";
import { Tag } from "../../features/team/models/tag.model";

export interface SearchQueryDTO
{
  queries: Tag[],
  teamsPerPage?: number,
  selectedPage?: number,
  order?: TeamSearchOrder
}