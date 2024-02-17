using api.Data;
using api.Models.DBPoketeamModels;
using api.Util;
using api.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

namespace api.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly PokeTeamContext _pokeTeamsContext;
        private readonly PokeTeamContext _userContext;
        private readonly UserManager<User> _userManager;

        public UserService(PokeTeamContext dataContext,
            PokeTeamContext userContext,
            UserManager<User> userManager)
        {
            _pokeTeamsContext = dataContext;
            _userContext = userContext;
            _userManager = userManager;
        }
        
        public async Task<UserDTO> BuildUserDTO(User user, bool logged)
        {
            UserDTO userDTO = null;
            if (user != null)
            {
                userDTO = new UserDTO
                {
                    Name = user.Name,
                    Username = user.UserName,
                    TeamKeys = await GetUserTeamKeys(user, logged),
                    Picture = $"https://localhost:7134/images/sprites/profile-pics/{user.Picture}.jpeg",
                    Country = user.Country,
                    Visibility = user.Visibility ? true : false
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

        public async Task<bool> UserNameAvailable(string userName)
        {
            User user = _userContext.Users.FirstOrDefault(u => u.UserName == userName);
            if(user != null)
            {
                return false;
            }
            return true;
        }

        public async Task<bool> DeleteUserByUserName(string userName)
        {
            Printer.Log("Deleting user: ", userName);
            //cascade delete all user teams? -> only uploaded teams?
            //other option: let the teamx exist without an uploader,
            //just set it to null like anonimous
            try
            {
                User user = _userContext.Users.FirstOrDefault(u => u.UserName == userName);
                if (user != null)
                {
                    //for external logins
                    /*
                    foreach (var login in logins.ToList())
                    {
                        await _userManager.RemoveLoginAsync(login.UserId, new UserLoginInfo(login.LoginProvider, login.ProviderKey));
                    }
                    */
                    List<UserTeam> userTeams = _pokeTeamsContext.UserTeam.Where(ut => ut.UserId == user.Id).ToList();
                    if (userTeams.Count() > 0)
                    {
                        return false;
                    }

                    await _userManager.DeleteAsync(user);
                    await _userContext.SaveChangesAsync();
                    return true;
                }

            }
            catch (Exception ex)
            {
                Printer.Log("Exception in: DeleteUserByUserName(string userName)");
                Printer.Log(ex);
            }
            return false;
        }

        public async Task<List<string>> GetUserTeamKeys(User user, bool logged)
        {
            List<string> teamKeys = new List<string>();
            if (user == null) { Printer.Log(user.Name);  return teamKeys; }
            try
            {
                IQueryable<UserTeam> userTeams = _pokeTeamsContext.UserTeam.Where(ut => ut.UserId == user.Id);
                if(userTeams != null && userTeams.Count() > 0)
                {
                    foreach (UserTeam userTeam in userTeams)
                    {
                        if (userTeam != null && userTeam.TeamId != null)
                        {
                            Team team = await _pokeTeamsContext.Team.FindAsync(userTeam.TeamId);
                            if(team != null)
                            {
                                if(!logged)
                                {
                                    if(team.Visibility)
                                    {
                                        teamKeys.Add(team.Id);
                                    }
                                }
                                else
                                {
                                    teamKeys.Add(team.Id);
                                }
                            }
                        }
                    }
                    await _pokeTeamsContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Printer.Log("Exception in: GetUserTeamKeys(User user)");
                Printer.Log(ex);
            }
            return teamKeys;
        }
        

    }
}
