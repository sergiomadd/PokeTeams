export interface PokePaste
{
  name: string,
  nickname?: string,
  dexnumber?: number,
  teratype?: string,
  item: string,
  ability?: string,
  nature?: string,
  moves?: object[],
  stats?: string[],
  ivs?: string[],
  evs?: string[],
  level?: number,
  shiny?: boolean,
  gender?: string
}