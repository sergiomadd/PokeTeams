import { Country } from "../../../models/DTOs/country.dto";
import { Team } from "../../team/models/team.model";

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