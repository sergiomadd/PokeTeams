using api.Data;
using api.Models.DBModels;
using api.Models.DBPoketeamModels;
using api.Models.DTOs;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Transactions;
using api.Services.UserService;
using api.Util;
using Microsoft.AspNetCore.Components.Forms;
using api.Models;

namespace api.Services.TeamService
{
    public class TeamService : ITeamService
    {
        private readonly PoketeamContext _teamContext;
        private readonly LocalContext _localContext;
        private readonly IUserService _userService;

        private static Random random = new Random();

        public TeamService(
            PoketeamContext dataContext,
            LocalContext localContext,
            IUserService userService)
        {
            _teamContext = dataContext;
            _localContext = localContext;
            _userService = userService;
        }

        public async Task<TeamDTO?> GetTeam(string id)
        {
            TeamDTO teamDTO = null;
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

                string playerUserName = "Unkown";
                if (team.Player != null)
                {
                    User player = await _userService.GetUserById(team.Player);
                    playerUserName = player.UserName;
                }
                else if (team.AnonPlayer != null)
                {
                    playerUserName = team.AnonPlayer;
                }
                teamDTO = new TeamDTO(id, pokemons, team.Options, playerUserName);
            }
            return teamDTO;
        }

        public async Task<Team?> SaveTeam(TeamDTO inputTeam)
        {
            Team newTeam = null;
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

                User player = await _userService.GetUserByUserName(inputTeam.Player);

                newTeam = new Team
                {
                    Id = teamId,
                    Options = optionsString,
                    Player = player != null ? player.Id : null,
                    AnonPlayer = player == null ? inputTeam.Player : null,
                };
                await _teamContext.Team.AddAsync(newTeam);
                await _teamContext.SaveChangesAsync();
                await SaveTeamPokemons(newTeam, inputTeam.Pokemons);
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return null;
            }
            return newTeam;
        }

        private async Task<bool> SaveTeamPokemons(Team team, List<Pokemon> pokemons)
        {
            try
            {
                foreach (Pokemon pokemon in pokemons)
                {
                    JsonSerializerOptions options = new JsonSerializerOptions { IncludeFields = false };
                    string pokemonString = JsonSerializer.Serialize(pokemon, options);
                    TeamPokemon newTeamPokemon = new TeamPokemon
                    {
                        TeamId = team.Id,
                        Pokemon = pokemonString
                    };
                    await _teamContext.TeamPokemon.AddAsync(newTeamPokemon);
                }
                await _teamContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return false;
            }
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
