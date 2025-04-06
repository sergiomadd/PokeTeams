using Microsoft.IdentityModel.Tokens;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Models.DBPoketeamModels;
using System.Security.Cryptography;
using api.DTOs;
using System.Net;

namespace api.Util
{
    public class TokenGenerator(IConfiguration configuration)
    {
        public string GenerateAccessToken(User user)
        {
            var key = configuration["Jwt:Secret"]!;
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                //Claim = {type: value}
                Subject = new ClaimsIdentity(
                    [
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), //JsonTokenId
                        new Claim(JwtRegisteredClaimNames.Sub, user.Id), //Subject (username)
                        new Claim(ClaimTypes.Name, user.UserName.ToString())
                    ]),
                Expires = DateTime.UtcNow.AddMinutes(60),
                SigningCredentials = credentials,
                Issuer = configuration["JwtSettings:Issuer"],
                Audience = configuration["JwtSettings:Audience"],
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken(User user)
        {
            var key = configuration["Jwt:Secret"]!;
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                    [
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                        new Claim(ClaimTypes.Name, user.UserName.ToString())
                    ]),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = credentials,
                Issuer = configuration["JwtSettings:Issuer"],
                Audience = configuration["JwtSettings:Audience"],
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public ClaimsPrincipal? GetPrincipalFromRefreshToken(string token)
        {
            try
            {
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = configuration["JwtSettings:Issuer"],
                    ValidAudience = configuration["JwtSettings:Audience"],
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Secret"]!)),
                    ValidateLifetime = false
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                SecurityToken securityToken;
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
                var jwtSecurityToken = securityToken as JwtSecurityToken;
                if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    throw new SecurityTokenException("Invalid token");
                }
                return principal;
            }
            catch (Exception ex)
            {
                Printer.Log(ex);
            }
            return null;
        }

        public void SetTokensInsideCookie(JwtResponseDTO tokens, HttpContext context)
        {
            if (!string.IsNullOrEmpty(tokens.AccessToken))
            {
                context.Response.Cookies.Append("accessToken", tokens.AccessToken,
                    new CookieOptions
                    {
                        Expires = DateTime.UtcNow.AddMinutes(60),
                        HttpOnly = true,
                        IsEssential = true,
                        Secure = true,
                        SameSite = SameSiteMode.None
                    });
            }

            if (!string.IsNullOrEmpty(tokens.RefreshToken))
            {
                context.Response.Cookies.Append("refreshToken", tokens.RefreshToken,
                    new CookieOptions
                    {
                        Expires = DateTime.UtcNow.AddDays(7),
                        HttpOnly = true,
                        IsEssential = true,
                        Secure = true,
                        SameSite = SameSiteMode.None
                    });
            }
        }

        public void RemoveTokensFromCookie(HttpContext context)
        {
            context.Request.Cookies.TryGetValue("accessToken", out var accessToken);
            if (accessToken != null)
            {
                context.Response.Cookies.Append("accessToken", accessToken,
                    new CookieOptions
                    {
                        Expires = DateTime.Now.AddDays(-1),
                        HttpOnly = true,
                        IsEssential = true,
                        Secure = true,
                        SameSite = SameSiteMode.None
                    });
            }
            context.Request.Cookies.TryGetValue("refreshToken", out var refreshToken);
            if (refreshToken != null)
            {
                context.Response.Cookies.Append("refreshToken", refreshToken,
                    new CookieOptions
                    {
                        Expires = DateTime.Now.AddDays(-1),
                        HttpOnly = true,
                        IsEssential = true,
                        Secure = true,
                        SameSite = SameSiteMode.None
                    });
            }
        }
    }
}
