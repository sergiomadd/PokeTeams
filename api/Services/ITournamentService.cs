using api.DTOs;
using api.Models.DBPoketeamModels;

namespace api.Services
{
    public interface ITournamentService
    {
        public List<TournamentDTO> GetAllTournaments();
        public Task<TournamentDTO> GetTournamentByName(string name);
        public Task<Tournament> SaveTournament(TournamentDTO tournamentDTO);
        public List<TagDTO> QueryTournamentsByName(string key);
    }
}
