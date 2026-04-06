export interface PokePaste
{
  name?: string,
  nickname?: string,
  dexnumber?: number,
  teratype?: string,
  item?: string,
  ability?: string,
  nature?: string,
  moves?: (string | undefined)[],
  stats?: string[],
  ivs?: (string | number)[][],
  evs?: (string | number)[][],
  level?: number,
  shiny?: boolean,
  gender?: boolean,
  source: string
}