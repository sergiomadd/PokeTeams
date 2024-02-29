import { Team } from "./team.model";

export interface User
{
  name: string,
  username: string,
  picture?: string,
  teams: Team[],
  teamKeys?: string[],
  country: string,
  visibility: boolean,
    //logged
  email?: string,
  emailConfirmed?: boolean
}