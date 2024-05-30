using api.DTOs;
using api.Models.DBPoketeamModels;
using Microsoft.AspNetCore.Identity;

namespace api.Services
{
    public interface IPokeTeamService
    {

        public Task<TeamDTO?> GetTeam(string id);
        public Task<Team?> SaveTeam(TeamUploadDTO team, string loggedUserName);
        public Task<bool> DeleteTeam(string teamId);
        public Task<bool> DeleteUserTeams(User user);
        public Task<string> IncrementTeamViewCount(string teamKey);
        public Task<EditorDataDTO?> GetEditorData();
        public Task<List<TeamPreviewDTO>> QueryTeams(TeamSearchQueryDTO searchQuery);
    }
}
