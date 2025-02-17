using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace api.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly IHttpContextAccessor accessor;

        public IdentityService(IHttpContextAccessor accessor)
        {
            this.accessor = accessor;
        }

        public ClaimsPrincipal? GetUser()
        {
            return accessor?.HttpContext?.User;
        }

        public string? GetUserName()
        {
            ClaimsPrincipal? user = accessor?.HttpContext?.User;
            if(user?.Identity != null) 
            {
                return user.Identity.Name;
            }
            return null;
        }

        public string? GetUserID()
        {
            ClaimsPrincipal? claimsPrincipal = accessor?.HttpContext?.User;
            if (claimsPrincipal?.Identity != null)
            {
                Claim? claim = claimsPrincipal.FindFirst(JwtRegisteredClaimNames.Jti);
                return  claim?.Value;
            }
            return null;
        }
    }
}
