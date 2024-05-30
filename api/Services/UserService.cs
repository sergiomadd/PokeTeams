using api.Data;
using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Util;
using System.Text.Json;

namespace api.Services
{
    public class UserService : IUserService
    {
        private readonly PokeTeamContext _pokeTeamContext;

        public UserService(PokeTeamContext pokeTeamContext)
        {
            _pokeTeamContext = pokeTeamContext;
        }

        public async Task<UserDTO> BuildUserDTO(User user, bool logged)
        {
            if (user != null)
            {
                if (logged)
                {
                    return new UserDTO
                    {
                        Name = user.Name,
                        Username = user.UserName,
                        TeamKeys = await GetUserTeamKeys(user, logged),
                        Picture = $"https://localhost:7134/images/sprites/profile-pics/{user.Picture}.png",
                        Country = user.Country != null ? GetCountry(user.Country) : null,
                        Visibility = user.Visibility ? true : false,
                        Email = user.Email,
                        EmailConfirmed = user.EmailConfirmed
                    };
                }
                if (!user.Visibility)
                {
                    return new UserDTO
                    {
                        Username = user.UserName,
                        Picture = $"https://localhost:7134/images/sprites/profile-pics/{user.Picture}.png",
                        Visibility = user.Visibility ? true : false
                    };
                }
                return new UserDTO
                {
                    Name = user.Name,
                    Username = user.UserName,
                    TeamKeys = await GetUserTeamKeys(user, logged),
                    Picture = $"https://localhost:7134/images/sprites/profile-pics/{user.Picture}.png",
                    Country = GetCountry(user.Country),
                    Visibility = user.Visibility ? true : false
                };
            }
            return null;
        }

        public async Task<User> GetUserByUserName(string userName)
        {
            User user = _pokeTeamContext.Users.FirstOrDefault(u => u.UserName == userName);
            return user;
        }

        public async Task<User> GetUserById(string id)
        {
            User user = await _pokeTeamContext.Users.FindAsync(id);
            return user;
        }

        public async Task<bool> UserNameAvailable(string userName)
        {
            User user = _pokeTeamContext.Users.FirstOrDefault(u => u.UserName == userName);
            if (user != null)
            {
                return false;
            }
            return true;
        }

        public async Task<IdentityResponseDTO> ChangeName(User user, string newName)
        {
            user.Name = newName;
            _pokeTeamContext.User.Update(user);
            _pokeTeamContext.SaveChanges();
            return new IdentityResponseDTO() { Success = true };
        }

        public async Task<IdentityResponseDTO> UpdatePicture(User user, string newPictureKey)
        {
            user.Picture = newPictureKey;
            _pokeTeamContext.User.Update(user);
            _pokeTeamContext.SaveChanges();
            return new IdentityResponseDTO() { Success = true };
        }

        public CountryDTO GetCountry(string code)
        {
            CountryDTO country = null;
            using (StreamReader r = new StreamReader("wwwroot/data/countries.json"))
            {
                string json = r.ReadToEnd();
                List<CountryDTO> countries = JsonSerializer.Deserialize<List<CountryDTO>>(json);
                country = countries.Find(c => c.code.Equals(code));
                if (country != null)
                {
                    country.Icon = $"https://localhost:7134/images/sprites/flags/{country.code}.svg";
                }
                r.Close();
            }
            return country;
        }

        public async Task<List<UserQueryDTO>> QueryUsers(string key)
        {
            List<UserQueryDTO> queriedUsers = new List<UserQueryDTO>();
            List<User> users = _pokeTeamContext.Users
                .Where(u => u.UserName.Contains(key)).ToList();
            users.ForEach(user =>
            {
                queriedUsers.Add(new UserQueryDTO
                {
                    Username = user.UserName,
                    Picture = $"https://localhost:7134/images/sprites/profile-pics/{user.Picture}.png" ?? null,
                    Country = user.Country == null ? GetCountry(user.Country) : null,
                });
            });
            return queriedUsers;
        }

        public async Task<List<UserQueryDTO>> ChunkQueryUsers(string key, int startIndex, int pageSize)
        {
            List<UserQueryDTO> queriedUsers = new List<UserQueryDTO>();
            List<User> users = _pokeTeamContext.Users
                .Where(u => u.UserName.Contains(key))
                .Skip(startIndex).Take(pageSize).ToList();
            users.ForEach(user =>
            {
                queriedUsers.Add(new UserQueryDTO
                {
                    Username = user.UserName,
                    Picture = user.Picture ?? null,
                    Country = user.Country == null ? GetCountry(user.Country) : null,
                });
            });
            return queriedUsers;
        }

        public async Task<List<string>> GetUserTeamKeys(User user, bool logged)
        {
            List<string> teamKeys = new List<string>();
            List<Team> userTeams = new List<Team>();
            if (user == null) { Printer.Log(user.Name); return teamKeys; }
            try
            {
                //When logged user get all teams
                if (logged)
                {
                    userTeams = _pokeTeamContext.Team.Where(t => t.PlayerId == user.Id).ToList();
                }
                //When not logged get only public teams
                userTeams = _pokeTeamContext.Team.Where(t => t.PlayerId == user.Id && t.Visibility).ToList();
                //var test = _pokeTeamContext.Team.Where(t => t.PlayerId == user.Id && t.Visibility).Select(t => t.Id);

                foreach (Team team in userTeams)
                {
                    teamKeys.Add(team.Id);
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
