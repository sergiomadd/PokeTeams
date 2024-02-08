import { Team } from "./team.model";

export interface LoggedUser
{
  name: string,
  username: string,
  picture?: string,
  teams: Team[],
  teamKeys?: string[],
  country: string,
  visibility: boolean
}