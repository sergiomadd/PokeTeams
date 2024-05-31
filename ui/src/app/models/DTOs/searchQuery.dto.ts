import { TeamSearchOrder } from "../enums/teamSearchOrder.enum";

export interface SearchQueryDTO
{
  userName?: string | null,
  tournamentName?: string | null,
  regulation?: string | null,
  pokemons?: string[] | null,
  moves?: string[] | null,
  items?: string[] | null,
  teamsPerPage?: number,
  selectedPage?: number,
  order?: TeamSearchOrder
}