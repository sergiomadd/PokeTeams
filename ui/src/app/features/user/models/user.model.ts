import { Country } from "../../../models/DTOs/country.dto";
import { TeamPreview } from "../../team/models/teamPreview.model";

export interface User
{
  name: string,
  username: string,
  picture?: string,
  teams?: TeamPreview[],
  teamKeys?: string[],
  country?: Country,
  visibility: boolean,
  //logged
  email?: string,
  emailConfirmed?: boolean
}