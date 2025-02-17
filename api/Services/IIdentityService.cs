using System.Security.Claims;

namespace api.Services
{
    public interface IIdentityService
    {
        public ClaimsPrincipal? GetUser();
        public string? GetUserName();
        public string? GetUserID();
    }
}
