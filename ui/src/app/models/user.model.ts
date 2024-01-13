import { Team } from "./team.model";

export interface User
{
  name: string,
  username: string,
  picture: string,
  teams?: Team[]
}