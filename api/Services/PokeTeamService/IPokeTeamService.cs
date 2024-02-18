using api.Models.DBPoketeamModels;
using api.Models.DTOs;

namespace api.Services.TeamService
{
    public interface IPokeTeamService
    {
        
        public Task<TeamDTO?> GetTeam(string id);
        public Task<Team?> SaveTeam(TeamDTO team);
        public Task<EditorData?> GetEditorData();
        public Task<bool> DeleteTeam(string teamId);
        public Task<bool> DeleteUserTeams(User user);
        public Task<UserDTO> BuildUserDTO(User user, bool logged);
        public Task<User> GetUserByUserName(string userName);
        public Task<User> GetUserById(string id);
        public Task<bool> UserNameAvailable(string userName);

    }
}
