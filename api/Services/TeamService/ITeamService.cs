using api.Models.DBPoketeamModels;
using api.Models.DTOs;

namespace api.Services.TeamService
{
    public interface ITeamService
    {
        
        public Task<TeamDTO?> GetTeam(string id);
        public Task<Team?> SaveTeam(TeamDTO team);
        public Task<EditorData?> GetEditorData();
        public Task<bool> DeleteTeam(string teamId);
        public Task<bool> SaveUserTeam(string userID, string teamID);
        public Task<bool> DeleteUserTeams(User user);
        
    }
}
