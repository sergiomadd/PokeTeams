export interface PokePaste
{
  name: string,
  nickname?: string,
  dexnumber?: number,
  teratype?: string,
  item: string,
  ability?: string,
  nature?: string,
  moves?: string[],
  stats?: string[],
  ivs?: string[][],
  evs?: string[][],
  level?: number,
  shiny?: boolean,
  gender?: string
}