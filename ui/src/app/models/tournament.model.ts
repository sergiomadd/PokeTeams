import { Regulation } from "./regulation.model";

export interface Tournament 
{
  name: string,
  city?: string,
  countryCode?: string,
  official: boolean,
  regulation?: Regulation,
  date?: string
}