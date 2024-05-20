export interface SearchQueryDTO
{
  userName?: string | null,
  tournamentName?: string | null,
  regulation?: string | null,
  pokemons?: string[] | null,
  moves?: string[] | null,
  items?: string[] | null,
}