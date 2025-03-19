export interface SortOrder
{
  type: SortType | undefined,
  way: SortWay
}

export enum SortType
{
  date,
  views
}

export enum SortWay
{
  descending,
  ascending
}