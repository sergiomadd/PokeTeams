import { Country } from "./country.dto";

export interface User
{
  name: string,
  username: string,
  picture?: string,
  country?: Country,
  visibility: boolean,
}