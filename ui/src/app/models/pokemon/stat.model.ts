export interface Stat
{
  identifier: string,
  name: string,
  value: number
}

export const defaultStat: Stat = 
{
  identifier: "error",
  name: "Not Found",
  value: 0
}