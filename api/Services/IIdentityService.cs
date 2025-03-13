using api.Models.DBPoketeamModels;
using System.Security.Claims;

namespace api.Services
{
    public interface IIdentityService
    {
        public Task<User?> GetUser();
        public string? GetUserName();
        public string? GetUserID();
        public bool CheckForRefresh(HttpRequest request);
    }
}
