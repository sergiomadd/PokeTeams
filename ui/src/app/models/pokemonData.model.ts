export interface PokemonData
{
  name: string,
  dexNumber: number,
  types: 		
  {
    id: number,
    type: string
  }[],
  stats: 	
  {
		identifier: string,
		name: string,
		stat: number
	}[]
}