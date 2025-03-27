using api.Models.DBPoketeamModels;
using System.Security.Claims;

namespace api.Services
{
    public interface IIdentityService
    {
        public Task<User?> GetLoggedUser();
        public string? GetLoggedUserName();
        public string? GetLoggedUserID();
        public bool CheckForRefresh(HttpRequest request);
    }
}
