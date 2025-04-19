using api.Data;
using api.DTOs;
using api.Models.DBModels;
using api.Models.DBPoketeamModels;
using api.Util;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Diagnostics.Metrics;
using System.Text.Json;

namespace api.Services
{
    public class UserService : IUserService
    {
        private readonly PokeTeamContext _pokeTeamContext;
        private readonly IConfiguration _config;
        private string baseUrl;

        public UserService(PokeTeamContext pokeTeamContext, IConfiguration config)
        {
            _pokeTeamContext = pokeTeamContext;
            _config = config;

            baseUrl = _config["BaseUrl"];
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
                        Picture = $"{baseUrl}images/profile-pics/{user.Picture}.png",
                        Visibility = user.Visibility ? true : false
                    };
                }
                return new UserDTO
                {
                    Name = user.Name,
                    Username = user.UserName,
                    Picture = $"{baseUrl}images/profile-pics/{user.Picture}.png",
                    Country = user.Country != null ? await GetCountry(user.Country) : null,
                    Visibility = user.Visibility ? true : false
                };
            }
            return null;
        }

        public async Task<User> GetUserById(string id)
        {
            User user = await _pokeTeamContext.Users.FindAsync(id);
            return user;
        }

        public async Task<User> GetUserByUserName(string userName)
        {
            User user = await _pokeTeamContext.Users.FirstOrDefaultAsync(u => u.UserName == userName);
            return user;
        }

        public async Task<bool> ChangeName(User user, string newName)
        {
            try
            {
                user.Name = newName;
                _pokeTeamContext.User.Update(user);
                await _pokeTeamContext.SaveChangesAsync();
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
                await _pokeTeamContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> DeleteRefreshToken(User user)
        {
            try
            {
                user.RefreshToken = null;
                _pokeTeamContext.User.Update(user);
                await _pokeTeamContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> UserNameAvailable(string userName)
        {
            User? user = await _pokeTeamContext.Users.FirstOrDefaultAsync(u => u.UserName == userName);
            if (user != null)
            {
                return false;
            }
            return true;
        }

        public async Task<CountryDTO?> GetCountry(string code)
        {
            CountryDTO? countryDTO = null;
            Country? country = await _pokeTeamContext.Country.FirstOrDefaultAsync(c => c.Code == code);
            if (country != null)
            {
                countryDTO = new CountryDTO(country, $"{baseUrl}images/flags/{country.Code.ToUpperInvariant()}.svg");
            }
            return countryDTO;
        }

        public async Task<List<QueryResultDTO>> QueryCountriesByName(string key)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            var query =
                from country in _pokeTeamContext.Country.Where(i => i.NormalizedName.StartsWith(key.ToLower()))

            select new QueryResultDTO(country.Name, country.Code, $"{baseUrl}images/flags/{country.Code.ToUpperInvariant()}.svg", "country");

            queryResults = await query.ToListAsync();

            return queryResults;
        }

        public async Task<List<QueryResultDTO>> QueryAllCountries()
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            var query =
                from country in _pokeTeamContext.Country

                select new QueryResultDTO(country.Name, country.Code, $"{baseUrl}images/flags/{country.Code.ToUpperInvariant()}.svg", "country");

            queryResults = await query.ToListAsync();

            return queryResults;
        }

        public async Task<List<QueryResultDTO>> QueryUsers(string key)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            var query =
                from user in _pokeTeamContext.Users.Where(u => u.UserName.ToLower().StartsWith(key.ToLower()))

                select new QueryResultDTO(user.UserName, user.UserName, $"{baseUrl}images/profile-pics/{user.Picture}.png", "user");

            queryResults = await query.ToListAsync();

            return queryResults;
        }

        public async Task<List<QueryResultDTO>> ChunkQueryUsers(string key, int startIndex, int pageSize)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            var query =
                from user in _pokeTeamContext.Users.Where(u => u.UserName.Contains(key)).Skip(startIndex).Take(pageSize)

                select new QueryResultDTO(user.UserName, user.UserName, $"{baseUrl}images/profile-pics/{user.Picture}.png", "user");

            queryResults = await query.ToListAsync();

            return queryResults;
        }

        //Keep incase countries change
        /*
        public async Task<bool> AddCountry(Country countryModel)
        {
            try
            {
                await _pokeTeamContext.Country.AddAsync(countryModel);
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
