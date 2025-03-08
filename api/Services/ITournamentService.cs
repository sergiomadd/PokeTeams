using api.DTOs;
using api.Models.DBPoketeamModels;

namespace api.Services
{
    public interface ITournamentService
    {
        public List<TournamentDTO> GetAllTournaments();
        public Task<TournamentDTO> GetTournamentByNormalizedName(string name);
        public Task<Tournament> SaveTournament(TournamentDTO tournamentDTO);
        public List<QueryResultDTO> QueryAllTournaments();
        public List<QueryResultDTO> QueryTournamentsByNormalizedName(string key);
        public bool TournamentAvailable(string tournamentName);
    }
}
