using api.DTOs;
using api.Models.DBPoketeamModels;

namespace api.Services
{
    public interface ITournamentService
    {
        public Task<TournamentDTO?> GetTournamentByNormalizedName(string name);
        public Task<List<TournamentDTO>> GetAllTournaments();
        public Task<Tournament?> SaveTournament(TournamentDTO tournamentDTO);
        public Task<List<QueryResultDTO>> QueryTournamentsByNormalizedName(string key);
        public Task<List<QueryResultDTO>> QueryAllTournaments();
    }
}
