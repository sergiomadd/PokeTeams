using api.DTOs;
using api.Models.DBPoketeamModels;
using Microsoft.AspNetCore.Identity;

namespace api.Services
{
    public interface IUserService
    {
        public Task<UserDTO> BuildUserDTO(User user, bool logged = false);
        public Task<User> GetUserByUserName(string userName);
        public Task<User> GetUserById(string id);
        public Task<bool> UserNameAvailable(string userName);
        public Task<bool> ChangeName(User user, string newName);
        public Task<bool> UpdatePicture(User user, string newPictureKey);
        public Task<bool> DeleteRefreshToken(User user);
        public Task<List<QueryResultDTO>> QueryUsers(string key);
        public Task<List<QueryResultDTO>> ChunkQueryUsers(string key, int startIndex, int pageSize);
        public CountryDTO? GetCountry(string code);
        public List<QueryResultDTO> QueryCountriesByName(string key);
        public List<QueryResultDTO> QueryAllCountries();

        //public Task<bool> AddCountry(CountryDTOB countryDTOB);
    }
}
