import { Tag } from "../../team/models/tag.model";
import { SetOperation } from "./setOperation.enum";
import { TeamSearchOrder } from "./teamSearchOrder.enum";

export interface SearchQueryDTO
{
  queries: Tag[],
  teamsPerPage?: number,
  selectedPage?: number,
  order?: TeamSearchOrder,
  setOperation?: SetOperation
}