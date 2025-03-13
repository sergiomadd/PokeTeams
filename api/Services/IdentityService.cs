using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using api.Util;
using api.Models.DBPoketeamModels;
using Azure.Core;

namespace api.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly IHttpContextAccessor _accessor;
        private readonly IUserService _userService;

        public IdentityService(IHttpContextAccessor accessor, IUserService userService)
        {
            _accessor = accessor;
            _userService = userService;
        }

        public async Task<User?> GetUser()
        {
            string? username = GetUserName();
            if(username != null)
            {
                return await _userService.GetUserByUserName(username);
            }
            return null;
        }

        public string? GetUserName()
        {
            ClaimsPrincipal? claimsPrincipal = _accessor?.HttpContext?.User;
            if(claimsPrincipal != null && claimsPrincipal.Identity != null && claimsPrincipal.Identity.IsAuthenticated) 
            {
                return claimsPrincipal.Identity.Name;
            }
            return null;
        }

        public string? GetUserID()
        {
            ClaimsPrincipal? claimsPrincipal = _accessor?.HttpContext?.User;
            if (claimsPrincipal != null && claimsPrincipal.Identity != null && claimsPrincipal.Identity.IsAuthenticated)
            {
                Claim? claim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier);
                return  claim?.Value;
            }
            return null;
        }

        //Replaces JWT middleware challenge for AllowAnonymous & Authorized endpoints
        //Refreshes access token if user is logged in
        public bool CheckForRefresh(HttpRequest request)
        {
            request.Cookies.TryGetValue("accessToken", out var accessToken);
            request.Cookies.TryGetValue("refreshToken", out var refreshToken);
            if (string.IsNullOrEmpty(accessToken) && !string.IsNullOrEmpty(refreshToken))
            {
                return true;
            }
            return false;
        }
    }
}
