import { QueryItem } from "src/app/core/models/misc/queryResult.model";
import { SetOperation } from "./setOperation.enum";
import { SortOrder } from "./sortOrder.model";

export interface SearchQueryDTO
{
  queries: QueryItem[],
  teamsPerPage?: number,
  selectedPage?: number,
  sortOrder?: SortOrder,
  setOperation?: SetOperation
}