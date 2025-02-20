using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using api.Util;

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
            ClaimsPrincipal? claimsPrincipal = accessor?.HttpContext?.User;
            if(claimsPrincipal != null && claimsPrincipal.Identity != null && claimsPrincipal.Identity.IsAuthenticated) 
            {
                return claimsPrincipal.Identity.Name;
            }
            return null;
        }

        public string? GetUserID()
        {
            ClaimsPrincipal? claimsPrincipal = accessor?.HttpContext?.User;
            if (claimsPrincipal != null && claimsPrincipal.Identity != null && claimsPrincipal.Identity.IsAuthenticated)
            {
                Claim? claim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier);
                return  claim?.Value;
            }
            return null;
        }
    }
}
