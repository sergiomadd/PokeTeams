using api.Data;
using api.Models.DBPoketeamModels;
using api.Util;
using api.Models.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace api.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly PoketeamContext _pokeTeamsContext;
        private readonly UserContext _userContext;

        public UserService(PoketeamContext dataContext, UserContext userContext)
        {
            _pokeTeamsContext = dataContext;
            _userContext = userContext;
        }

        public async Task<UserDTO> BuildUserDTO(User user)
        {
            UserDTO userDTO = null;
            if (user != null)
            {
                userDTO = new UserDTO
                {
                    Name = user.Name,
                    Username = user.UserName,
                    TeamKeys = await GetUserTeamKeys(user)
                };
            }
            return userDTO;
        }

        public async Task<User> GetUserByUserName(string userName)
        {
            User user = _userContext.Users.FirstOrDefault(u => u.UserName == userName);
            return user;
        }

        public async Task<User> GetUserById(string id)
        {
            User user = await _userContext.Users.FindAsync(id);
            return user;
        }

        public async Task<bool> DeleteUserByUserName(string userName)
        {
            UserDTO userDTO = null;
            User user = _userContext.Users.FirstOrDefault(u => u.UserName == userName);
            if (user != null)
            {
                //cascade delete all user teams? -> only uploaded teams?
                //other option: let the teamx exist without an uploader,
                //just set it to null like anonimous
                _userContext.Users.Remove(user);
                await _pokeTeamsContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<List<string>> GetUserTeamKeys(User user)
        {
            List<string> teamKeys = new List<string>();
            try
            {
                IQueryable<UserTeam> userTeams = _pokeTeamsContext.UserTeam.Where(ut => ut.UserId == user.Id);
                if(userTeams != null)
                {
                    foreach (UserTeam userTeam in userTeams)
                    {
                        Team team = await _pokeTeamsContext.Team.FindAsync(userTeam.TeamId);
                        teamKeys.Add(team.Id);
                    }
                    await _pokeTeamsContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex);
            }
            return teamKeys;
        }

        public async Task<bool> AddTeamToUser(string userID, string teamID)
        {
            try
            {
                IQueryable<UserTeam> userTeams = _pokeTeamsContext.UserTeam.Where(ut => ut.UserId == userID);
                if(userTeams != null)
                {
                    if(userTeams.Any(ut => ut.TeamId == teamID))
                    {
                        return false;
                    }
                    UserTeam newUserTeam = new UserTeam
                    {
                        UserId = userID,
                        TeamId = teamID
                    };
                    _pokeTeamsContext.UserTeam.Add(newUserTeam);
                    await _pokeTeamsContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex);
                return false;
            }
            return true;
        }
    }
}
