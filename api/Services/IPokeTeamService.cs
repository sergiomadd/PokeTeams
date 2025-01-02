using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBPoketeamModels;
using Microsoft.AspNetCore.Identity;

namespace api.Services
{
    public interface IPokeTeamService
    {

        public Task<TeamDTO?> GetTeam(string id, int langId);
        public Task<Team?> GetTeamModel(string id);
        public Task<TeamDataDTO?> GetTeamData(string id, int langId);
        public Task<PokemonDTO?> GetPokemonById(int id, int langId);
        public Task<PokemonPreviewDTO?> GetPokemonPreviewById(int id, int langId);
        public Task<List<PokemonPreviewDTO?>> GetTeamPreviewPokemons(string id, int langId);
        public Task<Team?> SaveTeam(TeamDTO team, string? loggedUserName);
        public Task<Team?> UpdateTeam(TeamDTO inputTeam, string currentTeamID, string? loggedUserName);
        public Task<bool> DeleteTeam(Team team);
        public Task<bool> DeleteTeamById(string teamId);
        public Task<bool> DeleteUserTeams(User user);
        public Task<string> IncrementTeamViewCount(string teamKey);
        public Task<TeamSearchQueryResponseDTO> QueryTeams(TeamSearchQueryDTO searchQuery, int langId);
    }
}
