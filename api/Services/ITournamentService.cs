using api.DTOs;
using api.Models.DBPoketeamModels;

namespace api.Services
{
    public interface ITournamentService
    {
        public Task<List<TournamentDTO>> GetAllTournaments();
        public Task<TournamentDTO> GetTournamentByNormalizedName(string name);
        public Task<Tournament> SaveTournament(TournamentDTO tournamentDTO);
        public Task<List<QueryResultDTO>> QueryAllTournaments();
        public Task<List<QueryResultDTO>> QueryTournamentsByNormalizedName(string key);
        public bool TournamentAvailable(string tournamentName);
    }
}
