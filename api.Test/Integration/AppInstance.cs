using api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System.Text.Encodings.Web;
using System.Security.Claims;
using FakeItEasy;
using api.Services;
using api.Models.DBPoketeamModels;
using System.IdentityModel.Tokens.Jwt;

namespace api.Test.Integration
{
    public class AppInstance : WebApplicationFactory<Program>, IDisposable
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Test");

            builder.ConfigureAppConfiguration((hostingContext, config) => { config.AddUserSecrets<Program>(); });

            var configuration = new ConfigurationBuilder()
                .AddUserSecrets<AppInstance>().Build();

            builder.ConfigureTestServices(services =>
            {
                //Forget the connection string and options of real db
                services.RemoveAll(typeof(DbContextOptions<PokeTeamContext>));

                string? connectionString = GetConnectionString();

                // Add a new registration for dbcontext
                services.AddDbContext<PokeTeamContext>(options =>
                    options.UseSqlServer(connectionString));
                services.AddScoped<IPokeTeamContext, PokeTeamContext>();

                services.AddAuthentication("TestScheme")
                    .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("TestScheme", options => { });

                services.AddCors(options =>
                {
                    options.AddPolicy("AllowAll", builder =>
                    {
                        builder.AllowAnyOrigin()
                               .AllowAnyMethod()
                               .AllowAnyHeader();
                    });
                });

                //Makes sure the database is deleted before any tests
                //And initializes it
                var dbContext = CreatePokeTeamDbContext(services);
                SetUpDatabase(dbContext);
            });
        }

        public void SetUpDatabase(PokeTeamContext context)
        {
            var user = GetTestLoggedUser();
            context.Database.EnsureDeleted();
            context.Database.Migrate();
            context.User.Add(user);
            context.SaveChanges();
        }

        public void Dispose()
        {
            using (var scope = this.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
                context.Database.EnsureDeleted();
            }
        }

        public User GetTestLoggedUser()
        {
            return new User() { Id = "testid", UserName = "testusername" };
        }

        public static PokeTeamContext CreatePokeTeamDbContext(IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();
            var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
            return dbContext;
        }

        private static string? GetConnectionString()
        {
            var configuration = new ConfigurationBuilder()
                .AddUserSecrets<AppInstance>()
                .Build();
            var connectionString = configuration["ConnectionStrings:SQLServerPoketeamTest"];
            return connectionString;
        }

        public string GenerateValidJwtToken()
        {
            var configuration = new ConfigurationBuilder()
                .AddUserSecrets<AppInstance>()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .Build();
            var test = configuration["JwtSettings:Issuer"];
            var user = GetTestLoggedUser();

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
    }
}
