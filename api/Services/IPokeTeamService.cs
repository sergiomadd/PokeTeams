using api.DTOs;
using api.Models.DBPoketeamModels;
using Microsoft.AspNetCore.Identity;

namespace api.Services
{
    public interface IPokeTeamService
    {

        public Task<TeamDTO?> GetTeam(string id, int langId);
        public Task<Team?> SaveTeam(TeamDTO team, string loggedUserName);
        public Task<bool> DeleteTeam(string teamId);
        public Task<bool> DeleteUserTeams(User user);
        public Task<string> IncrementTeamViewCount(string teamKey);
        public Task<TeamSearchQueryResponseDTO> QueryTeams(TeamSearchQueryDTO searchQuery, int langId);
    }
}
