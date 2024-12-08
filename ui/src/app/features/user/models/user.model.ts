import { Country } from "../../../shared/DTOs/country.dto";

export interface User
{
  name: string,
  username: string,
  picture?: string,
  country?: Country,
  visibility: boolean,
}