using api.Data;
using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Util;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.IO;

namespace api.Services
{
    public class TournamentService : ITournamentService
    {
        private readonly PokeTeamContext _pokeTeamContext;
        private readonly IRegulationService _regulationService;


        public TournamentService(PokeTeamContext pokeTeamContext, IRegulationService regulationService) 
        {
            _pokeTeamContext = pokeTeamContext;
            _regulationService = regulationService;
        }

        public TournamentDTO BuildTournamentDTO(Tournament tournament)
        {
            TournamentDTO tournamentDTO = null;
            if (tournament != null)
            {
                tournamentDTO = new TournamentDTO
                {
                    Name = tournament.Name,
                    ShortName = tournament.ShortName,
                    City = tournament.City,
                    CountryCode = tournament.CountryCode,
                    Official = tournament.Official,
                    Category = tournament.Category,
                    StartDate = tournament.StartDate,
                    EndDate = tournament.EndDate
                };
            }
            return tournamentDTO;
        }

        public List<TournamentDTO> GetAllTournaments()
        {
            List<TournamentDTO> tournamentDTOs = new List<TournamentDTO>();
            List<Tournament> tournaments = _pokeTeamContext.Tournament.ToList();
            foreach (Tournament tournament in tournaments)
            {
                tournamentDTOs.Add(BuildTournamentDTO(tournament));
            }
            return tournamentDTOs;
        }

        public async Task<TournamentDTO> GetTournamentByNormalizedName(string normalizedName)
        {
            TournamentDTO tournamentDTO = null;
            if (normalizedName != null)
            {
                Tournament tournament = await _pokeTeamContext.Tournament.FindAsync(normalizedName);
                if (tournament != null)
                {
                    tournamentDTO = BuildTournamentDTO(tournament);
                }
            }
            return tournamentDTO;
        }

        public async Task<Tournament> SaveTournament(TournamentDTO tournamentDTO)
        {
            try
            {
                if (tournamentDTO != null)
                {
                    Tournament tournament = new Tournament(tournamentDTO);
                    await _pokeTeamContext.Tournament.AddAsync(tournament);
                    await _pokeTeamContext.SaveChangesAsync();
                    return tournament;
                }
            }
            catch (Exception ex)
            {
                Printer.Log("Error adding tournament");
                Printer.Log(ex.Message);
            }
            return null;
        }

        public List<QueryResultDTO> QueryAllTournaments()
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<Tournament> tournaments = _pokeTeamContext.Tournament.OrderByDescending(t => t.StartDate).ToList();
            foreach (Tournament tournament in tournaments)
            {
                string? path = null;
                switch (tournament.Category)
                {
                    case "regional":
                        path = "https://localhost:7134/images/vgc/regionals.png";
                        break;
                    case "special":
                        path = "https://localhost:7134/images/vgc/regionals.png";
                        break;
                    case "international":
                        path = "https://localhost:7134/images/vgc/internationals.png";
                        break;
                    case "world":
                        path = "https://localhost:7134/images/vgc/worlds.png";
                        break;
                    default:
                        path = null;
                        break;
                }
                queryResults.Add(new QueryResultDTO(tournament.ShortName, tournament.NormalizedName, type: "tournament", icon: path));
            }
            return queryResults;
        }

        public List<QueryResultDTO> QueryTournamentsByNormalizedName(string normalizedName)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<Tournament> tournaments = _pokeTeamContext.Tournament.Where(t => t.NormalizedName.Contains(normalizedName.ToUpper())).OrderByDescending(t => t.StartDate).ToList();
            if (tournaments != null && tournaments.Count > 0)
            {
                tournaments.ForEach(tournament =>
                {
                    string? path = null;
                    switch(tournament.Category)
                    {
                        case "regional":
                            path = "https://localhost:7134/images/vgc/regionals.png";
                            break;
                        case "special":
                            path = "https://localhost:7134/images/vgc/regionals.png";
                            break;
                        case "international":
                            path = "https://localhost:7134/images/vgc/internationals.png";
                            break;
                        case "world":
                            path = "https://localhost:7134/images/vgc/worlds.png";
                            break;
                        default:
                            path = null;
                            break;
                    }
                    queryResults.Add(new QueryResultDTO(tournament.ShortName, tournament.NormalizedName, type: "tournament", icon: path));
                });
            }
            return queryResults;
        }

        public bool TournamentAvailable(string tournamentName)
        {
            Tournament? tournament = _pokeTeamContext.Tournament.FirstOrDefault(u => u.NormalizedName == Formatter.NormalizeString(tournamentName));
            if (tournament != null)
            {
                return false;
            }
            return true;
        }
    }
}
