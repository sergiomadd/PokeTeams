export interface Type
{
  identifier: string,
  name: string,
  iconPath: string,
  effectivenessAttack: [string, number][],
  effectivenessDefense: [string, number][]
}