import { Tag } from "../../team/models/tag.model";
import { SetOperation } from "./setOperation.enum";
import { SortOrder } from "./sortOrder.model";

export interface SearchQueryDTO
{
  queries: Tag[],
  teamsPerPage?: number,
  selectedPage?: number,
  sortOrder?: SortOrder,
  setOperation?: SetOperation
}