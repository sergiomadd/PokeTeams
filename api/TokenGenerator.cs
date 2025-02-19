using Microsoft.IdentityModel.Tokens;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Models.DBPoketeamModels;
using System.Security.Cryptography;
using api.Util;
using api.DTOs;

namespace api
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
                        //Only necessary logged user data, not all user dto data
                        new Claim(JwtRegisteredClaimNames.Jti, user.Id.ToString()), //JsonTokenId
                        new Claim(JwtRegisteredClaimNames.Sub, user.UserName.ToString()),//Subject (username)
                        new Claim(ClaimTypes.Name, user.UserName.ToString()),
                        new Claim(JwtRegisteredClaimNames.Email, user.Email.ToString()),
                        new Claim("email_verified", user.EmailConfirmed.ToString())
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
                //Claim = {type: value}
                Subject = new ClaimsIdentity(
                    [
                        //Only necessary logged user data, not all user dto data
                        new Claim(JwtRegisteredClaimNames.Jti, user.Id.ToString()), //JsonTokenId
                        new Claim(JwtRegisteredClaimNames.Sub, user.UserName.ToString()),//Subject (username)
                        new Claim(ClaimTypes.Name, user.UserName.ToString()),
                        new Claim(JwtRegisteredClaimNames.Email, user.Email.ToString()),
                        new Claim("email_verified", user.EmailConfirmed.ToString())
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
            if(string.IsNullOrEmpty(tokens.AccessToken) || string.IsNullOrEmpty(tokens.RefreshToken))
            {
                return;
            }
            context.Response.Cookies.Append("accessToken", tokens.AccessToken,
                new CookieOptions
                {
                    Expires = DateTime.UtcNow.AddMinutes(1), //should be 60
                    HttpOnly = true,
                    IsEssential = true,
                    Secure = true,
                    SameSite = SameSiteMode.None
                });

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
}
