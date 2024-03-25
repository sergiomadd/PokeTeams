global using api.Models;

using api.Data;
using api.Services.PokemonService;
using api.Services.TeamService;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.Cookies;
using api.Models.DBPoketeamModels;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMvc();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<PokedexContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("SQLServerPokedex")));
builder.Services.AddDbContext<PokeTeamContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("SQLServerPoketeam")), ServiceLifetime.Scoped);
builder.Services.AddDbContext<LocalContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("SQLServerPoketeam")));

builder.Services.AddTransient<IPokemonService, PokemonService>();
builder.Services.AddScoped<IPokeTeamService, PokeTeamService>();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie();
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
});
builder.Services.AddAuthorization();
builder.Services.AddIdentity<User, IdentityRole>(
    options =>
    {
        //Password
        options.Password.RequiredLength = 4;
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;

        //Require email confirmation
        options.SignIn.RequireConfirmedEmail = false;

        //Lockout
        options.Lockout.AllowedForNewUsers = true;
        options.Lockout.MaxFailedAccessAttempts = 5;
    })
    .AddRoles<IdentityRole>()
    .AddRoleManager<RoleManager<IdentityRole>>()
    .AddSignInManager<SignInManager<User>>()
    .AddUserManager<UserManager<User>>()
    .AddDefaultTokenProviders()
    .AddEntityFrameworkStores<PokeTeamContext>();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromSeconds(1800);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddRouting(options => options.LowercaseUrls = true);

var apiCorsPolicy = "_apiCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: apiCorsPolicy,
                      builder =>
                      {
                          builder.WithOrigins("http://localhost:4200", "https://localhost:7134/")
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                      });
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

builder.Services.AddRateLimiter(rateLimiterOptions =>
{
    rateLimiterOptions.AddFixedWindowLimiter("fixed", options =>
    {
        options.PermitLimit = 1;
        options.Window = TimeSpan.FromSeconds(60);
        options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        options.QueueLimit = 0;
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(apiCorsPolicy);
}

app.UseRateLimiter();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseSession();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
