global using api.Models;

using api.Data;
using api.Services.PokemonService;
using api.Services.TeamService;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMvc();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<PokedexContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("SQLServerPokedex")));
builder.Services.AddDbContext<PoketeamContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("SQLServerPoketeam")), ServiceLifetime.Scoped);
builder.Services.AddDbContext<LocalContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("SQLServerPoketeam")));
builder.Services.AddDbContext<UserContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("SQLServerPoketeam")));

builder.Services.AddTransient<IPokemonService, PokemonService>();
builder.Services.AddScoped<ITeamService, TeamService>();

builder.Services.AddAuthentication("cookie").AddCookie("cookie");
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
    .AddDefaultTokenProviders()
    .AddEntityFrameworkStores<UserContext>();

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


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(apiCorsPolicy);
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();
