using api.DTOs;
using api.Models.DBPoketeamModels;

namespace api.Services
{
    public interface IUserService
    {
        public Task<UserDTO> BuildUserDTO(User user, bool logged);
        public Task<List<UserQueryDTO>> QueryUsers(string key);
        public Task<List<UserQueryDTO>> ChunkQueryUsers(string key, int startIndex, int pageSize);
        public Task<User> GetUserByUserName(string userName);
        public Task<User> GetUserById(string id);
        public Task<bool> UserNameAvailable(string userName);
        public Task<IdentityResponseDTO> ChangeName(User user, string newName);
        public Task<IdentityResponseDTO> UpdatePicture(User user, string newPictureKey);
        public CountryDTO GetCountry(string code);
    }
}
