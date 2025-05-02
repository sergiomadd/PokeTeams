using api.Data;
using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Util;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class TournamentService : ITournamentService
    {
        private readonly PokeTeamContext _pokeTeamContext;
        private readonly IConfiguration _config;
        private static string baseUrl;

        public TournamentService(PokeTeamContext pokeTeamContext, IConfiguration config) 
        {
            _pokeTeamContext = pokeTeamContext;
            _config = config;

            baseUrl = "";
            string? baseUrlTemp = _config["BaseUrl"];
            if (baseUrlTemp != null)
            {
                baseUrl = (string)baseUrlTemp;
            }
        }

        public async Task<TournamentDTO?> BuildTournamentDTO(Tournament tournament)
        {
            TournamentDTO? tournamentDTO = null;
            if (tournament != null)
            {
                tournamentDTO = new TournamentDTO
                {
                    Name = tournament.Name,
                    ShortName = tournament.ShortName,
                    City = tournament.City,
                    CountryCode = tournament.CountryCode,
                    CountryName = await GetCountryName(tournament.CountryCode),
                    Official = tournament.Official,
                    Category = tournament.Category,
                    Icon = GetTournamentIcon(tournament.Category),
                    StartDate = tournament.StartDate,
                    EndDate = tournament.EndDate
                };
            }
            return tournamentDTO;
        }

        public async Task<TournamentDTO?> GetTournamentByNormalizedName(string normalizedName)
        {
            TournamentDTO? tournamentDTO = null;
            if (normalizedName != null)
            {
                Tournament? tournament = await _pokeTeamContext.Tournament.FindAsync(normalizedName);
                if (tournament != null)
                {
                    tournamentDTO = await BuildTournamentDTO(tournament);
                }
            }
            return tournamentDTO;
        }

        public async Task<List<TournamentDTO>> GetAllTournaments()
        {
            List<TournamentDTO> tournamentDTOs = new List<TournamentDTO>();

            var query =
                from tournament in _pokeTeamContext.Tournament.OrderByDescending(t => t.StartDate)

                select new TournamentDTO
                {
                    Name = tournament.Name,
                    ShortName = tournament.ShortName,
                    City = tournament.City,
                    CountryCode = tournament.CountryCode,
                    CountryName = GetCountryName(tournament.CountryCode).Result,
                    Official = tournament.Official,
                    Category = tournament.Category,
                    Icon = GetTournamentIcon(tournament.Category),
                    StartDate = tournament.StartDate,
                    EndDate = tournament.EndDate
                };

            tournamentDTOs = await query.ToListAsync();

            return tournamentDTOs;
        }

        public async Task<Tournament?> SaveTournament(TournamentDTO tournamentDTO)
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

        public async Task<List<QueryResultDTO>> QueryAllTournaments()
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            var query =
                from tournament in _pokeTeamContext.Tournament.OrderByDescending(t => t.StartDate)

                select new QueryResultDTO(tournament.ShortName, tournament.NormalizedName, GetTournamentIcon(tournament.Category), "tournament");

            queryResults = await query.ToListAsync();

            return queryResults;
        }

        public async Task<List<QueryResultDTO>> QueryTournamentsByNormalizedName(string normalizedName)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            var query =
                from tournament in _pokeTeamContext.Tournament.Where(t => t.NormalizedName.Contains(normalizedName.ToUpper())).OrderByDescending(t => t.StartDate)

                select new QueryResultDTO(tournament.ShortName, tournament.NormalizedName, GetTournamentIcon(tournament.Category), "tournament");

            queryResults = await query.ToListAsync();
            return queryResults;
        }

        private async Task<string?> GetCountryName(string? countryCode)
        {
            Country? country = await _pokeTeamContext.Country.FirstOrDefaultAsync(c => countryCode != null && c.Code.ToLower() == countryCode.ToLower());
            if(country != null && country.Name != null)
            {
                return country.Name;
            }
            return null;
        }

        private static string? GetTournamentIcon(string? category)
        {
            string? path = null;
            switch (category)
            {
                case "regional":
                    path = $"{baseUrl}images/vgc/regionals.png";
                    break;
                case "special":
                    path = $"{baseUrl}images/vgc/regionals.png";
                    break;
                case "international":
                    path = $"{baseUrl}images/vgc/internationals.png";
                    break;
                case "world":
                    path = $"{baseUrl}images/vgc/worlds.png";
                    break;
                default:
                    path = null;
                    break;
            }
            return path;
        }
    }
}
