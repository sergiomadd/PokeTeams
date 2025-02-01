using api.Data;
using api.DTOs;
using api.Models.DBModels;
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

        public async Task<UserDTO> BuildUserDTO(User user, bool logged = false)
        {
            if (user != null)
            {
                //private and not logged
                if (!user.Visibility && !logged)
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
                    Picture = $"https://localhost:7134/images/sprites/profile-pics/{user.Picture}.png",
                    Country = user.Country != null ? GetCountry(user.Country) : null,
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

        public async Task<bool> ChangeName(User user, string newName)
        {
            try
            {
                user.Name = newName;
                _pokeTeamContext.User.Update(user);
                _pokeTeamContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> UpdatePicture(User user, string newPictureKey)
        {
            try
            {
                user.Picture = newPictureKey;
                _pokeTeamContext.User.Update(user);
                _pokeTeamContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public CountryDTO? GetCountry(string code)
        {
            CountryDTO? countryDTO = null;
            Country? country = _pokeTeamContext.Country.FirstOrDefault(c => c.Code == code);
            if (country != null)
            {
                countryDTO = new CountryDTO(country);
            }
            return countryDTO;
        }

        public List<QueryResultDTO> QueryCountriesByName(string key)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<Country> countries = _pokeTeamContext.Country.Where(i => i.NormalizedName.Contains(key.ToLower())).ToList();
            if (countries != null && countries.Count > 0)
            {
                countries.ForEach(country =>
                {
                    queryResults.Add(new QueryResultDTO(country.Name, country.Code, type: "country", icon: $"https://localhost:7134/images/sprites/flags/{country.Code}.svg"));
                });
            }
            return queryResults;
        }

        public List<QueryResultDTO> QueryAllCountries()
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<Country> countries = _pokeTeamContext.Country.ToList();
            if (countries != null && countries.Count > 0)
            {
                countries.ForEach(country =>
                {
                    queryResults.Add(new QueryResultDTO(country.Name, country.Code, type: "country", icon: $"https://localhost:7134/images/sprites/flags/{country.Code}.svg"));
                });
            }
            return queryResults;
        }

        public async Task<List<QueryResultDTO>> QueryUsers(string key)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<User> users = _pokeTeamContext.Users
                .Where(u => u.UserName.Contains(key)).ToList();
            users.ForEach(user =>
            {
                string profilePicPath = $"https://localhost:7134/images/sprites/profile-pics/{user.Picture}.png";
                queryResults.Add(new QueryResultDTO(user.UserName, user.UserName, icon: profilePicPath, type: "user"));
            });
            return queryResults;
        }

        public async Task<List<QueryResultDTO>> ChunkQueryUsers(string key, int startIndex, int pageSize)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<User> users = _pokeTeamContext.Users
                .Where(u => u.UserName.Contains(key))
                .Skip(startIndex).Take(pageSize).ToList();
            users.ForEach(user =>
            {
                string profilePicPath = $"https://localhost:7134/images/sprites/profile-pics/{user.Picture}.png";
                queryResults.Add(new QueryResultDTO(user.UserName, user.UserName, icon: profilePicPath, type: "user"));
            });
            return queryResults;
        }

        //Keep incase countries change IRL
        /*
        public async Task<bool> AddCountry(CountryDTOB countryDTOB)
        {
            try
            {
                Country country = new Country
                {
                    NormalizedName = countryDTOB.NormalizedName,
                    Name = countryDTOB.Name,
                    Code = countryDTOB.Code
                };
                await _pokeTeamContext.Country.AddAsync(country);
                await _pokeTeamContext.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Printer.Log(e);
                return false;
            }
            return true;
        }
        */

    }
}
