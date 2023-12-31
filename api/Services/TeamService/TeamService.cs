using api.Data;
using api.Models;
using api.Models.DBModels;
using api.Models.DBPoketeamModels;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Transactions;

namespace api.Services.TeamService
{
    public class TeamService : ITeamService
    {
        private readonly PoketeamContext _teamContext;
        private readonly LocalContext _localContext;

        private static Random random = new Random();

        public TeamService(PoketeamContext dataContext, LocalContext localContext)
        {
            _teamContext = dataContext;
            _localContext = localContext;
        }

        public async Task<TeamData?> GetTeam(string id)
        {
            Team team = await _teamContext.Team.FindAsync(id);
            if (team != null)
            {
                List<Pokemon> pokemons = new List<Pokemon>();
                IQueryable<TeamPokemon> teamPokemon = _teamContext.TeamPokemon.Where(t => t.TeamId == id);
                foreach(var item in teamPokemon)
                {
                    try
                    {
                        Pokemon pokemon = JsonSerializer.Deserialize<Pokemon>(item.Pokemon, new JsonSerializerOptions { IncludeFields = false });
                        pokemons.Add(pokemon);
                    }
                    catch (Exception ex)
                    {
                    }
                }
                return new TeamData(pokemons, team.options);
            }
            return null;
        }

        public async Task<string?> Post(TeamData inputTeam)
        {
            string teamId = GenerateId(10);
            try
            {
                Team team = await _teamContext.Team.FindAsync(teamId);
                //loop maybe too ineficent? seek another way to get unused ids?
                while (team != null)
                {
                    teamId = GenerateId(10);
                    team = await _teamContext.Team.FindAsync(teamId);
                }

                JsonSerializerOptions options = new JsonSerializerOptions { IncludeFields = false };
                string optionsString = JsonSerializer.Serialize(inputTeam.Options, options);
                Team newTeam = new Team
                {
                    id = teamId,
                    options = optionsString
                };
                await _teamContext.Team.AddAsync(newTeam);

                foreach (Pokemon pokemon in inputTeam.Pokemons)
                {
                    string pokemonString = JsonSerializer.Serialize(pokemon, options);
                    TeamPokemon newTeamPokemon = new TeamPokemon
                    {
                        TeamId = teamId,
                        Pokemon = pokemonString
                    };
                    await _teamContext.TeamPokemon.AddAsync(newTeamPokemon);
                }
                await _teamContext.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
            }
            return teamId;
        }

        public string GenerateId(int length)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<EditorData?> GetEditorData()
        {
            EditorData editorData = _localContext.GetEditorData();
            
            return editorData;
        }

    }
}
