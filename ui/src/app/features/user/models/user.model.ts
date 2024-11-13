import { Country } from "../../../models/DTOs/country.dto";

export interface User
{
  name: string,
  username: string,
  picture?: string,
  country?: Country,
  visibility: boolean,
  //logged
  email?: string,
  emailConfirmed?: boolean
}