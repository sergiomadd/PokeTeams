using api.Models.DBPoketeamModels;
using api.Models.DTOs;

namespace api.Services.TeamService
{
    public interface ITeamService
    {
        public Task<TeamDTO?> GetTeam(string id);
        public Task<Team?> SaveTeam(TeamDTO team);
        public Task<EditorData?> GetEditorData();
    }
}
