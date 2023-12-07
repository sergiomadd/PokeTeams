global using api.Models;

using api.Data;
using api.Services.PokemonService;
using api.Services.TeamService;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<PokedexContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("SQLServerPokedex")));
builder.Services.AddDbContext<PoketeamContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("SQLServerPoketeam")));
builder.Services.AddDbContext<LocalContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("SQLServerPoketeam")));
builder.Services.AddTransient<IPokemonService, PokemonService>();
builder.Services.AddScoped<ITeamService, TeamService>();


builder.Services.AddRouting(options => options.LowercaseUrls = true);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();
