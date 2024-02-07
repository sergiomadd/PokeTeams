using api.Models.DBPoketeamModels;
using api.Models.DTOs;

namespace api.Services.UserService
{
    public interface IUserService
    {
        public Task<UserDTO> BuildUserDTO(User user, bool logged);
        public Task<User> GetUserByUserName(string userName);
        public Task<User> GetUserById(string id);
        public Task<bool> UserNameAvailable(string userName);
        public Task<bool> DeleteUserByUserName(string userName);
        public Task<bool> AddTeamToUser(string userID, string teamID);
    }
}
