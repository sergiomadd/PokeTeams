using Microsoft.IdentityModel.Tokens;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Models.DBPoketeamModels;

namespace api
{
    public class TokenGenerator(IConfiguration configuration)
    {
        public string GenerateToken(User user)
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
                        new Claim(JwtRegisteredClaimNames.Sub, user.UserName.ToString()), //Subject (user id)
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
    }
}
