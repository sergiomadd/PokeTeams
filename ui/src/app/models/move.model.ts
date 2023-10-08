export interface Move
{
  name: string,
  type: string,
  damageClass: 
  {
    name: string,
    description: string
  },
  power: number,
  pp: number,
  accuracy: number,
  priority: number,
  target: 
  {
    name: string,
    description: string
  },
  effect: 
  {
    shortEffect: string,
    longEffect: string,
    effectChance: number
  },
  metadata: 
  {
    minHits: number,
    maxHits: number,
    minTurns: number,
    maxTurns: number,
    drain: number,
    healing: number,
    critRate: number,
    statusChance: number,
    flinchChance: number,
    statChange:
    {
      stat:
      {
        identifier: string,
        name: string,
        baseStat: number
      },
      change: number,
      statChance: number
    }
  },
}