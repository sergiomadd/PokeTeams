export interface Ability
{
  identifier: string,
  name: string,
  prose: string	
}

export const defaultAbility: Ability = 
{
  identifier: "error",
  name: "Not Found",
  prose: ""
}