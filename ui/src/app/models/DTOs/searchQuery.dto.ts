import { TeamSearchOrder } from "../enums/teamSearchOrder.enum";
import { Tag } from "../tag.model";

export interface SearchQueryDTO
{
  queries: Tag[],
  teamsPerPage?: number,
  selectedPage?: number,
  order?: TeamSearchOrder
}