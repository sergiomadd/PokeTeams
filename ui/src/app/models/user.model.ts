import { Country } from "./DTOs/country.dto";
import { Team } from "./team.model";

export interface User
{
  name: string,
  username: string,
  picture?: string,
  teams?: Team[],
  teamKeys?: string[],
  country?: Country,
  visibility: boolean,
  //logged
  email?: string,
  emailConfirmed?: boolean
}