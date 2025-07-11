using api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using api.Models.DBPoketeamModels;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Google.Apis.Auth;
using api.Services;


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
                var configuration = new ConfigurationBuilder()
                    .AddEnvironmentVariables()
                    .AddUserSecrets<AppInstance>()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.Test.json", optional: true, reloadOnChange: true)
                    .Build();

                //Forget the connection string and options of real db
                services.RemoveAll(typeof(DbContextOptions<PokeTeamContext>));

                var connectionString = configuration["ConnectionStrings:PostgrePoketeamTest"];

                //Add a new registration for dbcontext
                services.AddDbContext<PokeTeamContext>(options =>
                    options.UseNpgsql(connectionString));
                services.AddTransient<IPokeTeamContext, PokeTeamContext>();
                
                //Forget the jwt config
                services.RemoveAll(typeof(IConfigureOptions<AuthenticationOptions>));
                services.RemoveAll(typeof(IConfigureOptions<JwtBearerOptions>));

                //Add a new jwt config
                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Secret"]!)),
                        ValidIssuer = configuration["JwtSettings:Issuer"],
                        ValidAudience = configuration["JwtSettings:Audience"],
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true
                    };
                })
                .AddCookie(IdentityConstants.ApplicationScheme)
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("TestScheme", options => { });

                services.PostConfigure<AuthenticationOptions>(options =>
                {
                    options.DefaultAuthenticateScheme = "TestScheme";
                    options.DefaultChallengeScheme = "TestScheme";
                });

                services.AddCors(options =>
                {
                    options.AddPolicy("AllowAll", builder =>
                    {
                        builder.AllowAnyOrigin()
                               .AllowAnyMethod()
                               .AllowAnyHeader();
                    });
                });

                services.AddTransient<IExternalAuthService, FakeExternalAuthService>();

                services.RemoveAll(typeof(IEmailService));
                services.AddTransient<IEmailService, FakeEmailService>();

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

            var dbUser = context.User.FirstOrDefault(u => u.UserName == user.UserName);
            if(dbUser == null)
            {
                context.User.Add(user);
                context.SaveChanges();
            }
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
            return new User() { Id = "testLog", UserName = "testUserName" };
        }

        public User GetTestAuthLoggedUser()
        {
            return new User() 
            {
                Id = "testAuth",
                UserName = "testAuthUserName",
                Email = "testAuth@gmail.com",
                EmailConfirmed = false,
            };
        }

        public static PokeTeamContext CreatePokeTeamDbContext(IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();
            var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<PokeTeamContext>();
            return dbContext;
        }

        public string GenerateValidJwtToken(User? user)
        {
            var configuration = new ConfigurationBuilder()
                .AddEnvironmentVariables()
                .AddUserSecrets<AppInstance>()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true)
                .Build();
            var key = configuration["Jwt:Secret"]!;
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                    [
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Sub, user?.Id != null ? user.Id.ToString() : ""),
                        new Claim(ClaimTypes.Name, user?.UserName != null ? user.UserName.ToString() : "")
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

        public Task<GoogleJsonWebSignature.Payload?> GenerateGooglePayload()
        {
            return Task.FromResult<GoogleJsonWebSignature.Payload?>(new GoogleJsonWebSignature.Payload
            {
                Email = "testAuth@gmail.com",
                Subject = "1234567890",
                Name = "Test Auth User",
            });
        }
    }
}
