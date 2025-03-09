using api.Data;
using api.Models.DBPoketeamModels;
using System.Text.Json;
using api.Util;
using System.Data;
using Microsoft.EntityFrameworkCore;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using System.Security.Cryptography;
using api.Models.DBModels;
using System.Numerics;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using MethodTimer;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Linq;
using api.Models;
using System.Collections.Generic;
using NuGet.Packaging.Signing;
using Microsoft.AspNetCore.Components.Forms;
using System.Linq.Expressions;
using System.Reflection;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using System;
using System.Reflection.Metadata;
using System.Data.Common;
using static NuGet.Packaging.PackagingConstants;
using System.Collections.ObjectModel;
using System.IO;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.VisualBasic;
using Newtonsoft.Json.Linq;
using static System.Net.WebRequestMethods;
using System.Xml.Linq;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using LinqKit;
using System.Data.Entity.Core.Common.CommandTrees;
using System.Composition;
using System.Security.Cryptography.Xml;
using System.Xml.Serialization;
using Microsoft.IdentityModel.Tokens;
using Azure;

namespace api.Services
{
    public class PokeTeamService : IPokeTeamService
    {
        private readonly PokeTeamContext _pokeTeamContext;
        private readonly IPokedexService _pokedexService;
        private readonly IUserService _userService;
        private readonly ITournamentService _tournamentService;
        private readonly IRegulationService _regulationService;
        private readonly IIdentityService _identityService;

        private readonly UserManager<User> _userManager;


        private static Random random = new Random();

        public PokeTeamService
            (
                PokeTeamContext dataContext,
                IPokedexService pokedexService,
                IUserService userService,
                ITournamentService tournamentService,
                IRegulationService regulationService,
                UserManager<User> userManager,
                IIdentityService identityService
            )
        {
            _pokeTeamContext = dataContext;
            _pokedexService = pokedexService;
            _userService = userService;
            _tournamentService = tournamentService;
            _regulationService = regulationService;
            _userManager = userManager;
            _identityService = identityService;

        }

        public async Task<TeamDTO?> BuildTeamDTO(Team team, int langId)
        {
            TeamDTO teamDTO = null;
            if (team != null)
            {
                List<Pokemon> pokemons = _pokeTeamContext.Pokemon.Where(p => p.TeamId.Equals(team.Id)).ToList();
                List<PokemonDTO> pokemonDTOs = new List<PokemonDTO>();
                TeamOptionsDTO teamOptionsDTO = new TeamOptionsDTO(team.IVsVisibility, team.EVsVisibility, team.NaturesVisibility);
                if (team.PlayerId != null && team.PlayerId == _identityService.GetUserID())
                {
                    teamOptionsDTO.Logged();
                }

                foreach (Pokemon pokemon in pokemons)
                {
                    pokemonDTOs.Add(await _pokedexService.BuildPokemonDTO(pokemon, langId, teamOptionsDTO));
                }

                teamDTO = new TeamDTO(
                    team.Id,
                    pokemonDTOs,
                    await GetTeamPlayer(team),
                    await _tournamentService.GetTournamentByNormalizedName(team.TournamentNormalizedName),
                    await _regulationService.GetRegulationByIdentifier(team.Regulation),
                    team.RentalCode,
                    team.ViewCount,
                    team.DateCreated.ToString("yyyy-MM-dd"),
                    team.Visibility,
                    await GetTeamTags(team),
                    options: teamOptionsDTO
                    );
            }
            return teamDTO;
        }

        public async Task<TeamPreviewDTO?> BuildTeamPreviewDTO(Team team, int langId)
        {
            TeamPreviewDTO teamPreviewDTO = null;
            List<Pokemon> pokemons = _pokeTeamContext.Pokemon.Where(p => p.TeamId.Equals(team.Id)).ToList();
            List<int> pokemonPreviewIDs = new List<int>();

            foreach (Pokemon pokemon in pokemons)
            {
                pokemonPreviewIDs.Add(pokemon.Id);
            }

            teamPreviewDTO = new TeamPreviewDTO
            {
                ID = team.Id,
                PokemonIDs = pokemonPreviewIDs,
                Player = await GetTeamPlayer(team),
                Tournament = await _tournamentService.GetTournamentByNormalizedName(team.TournamentNormalizedName),
                Regulation = await _regulationService.GetRegulationByIdentifier(team.Regulation),
                ViewCount = team.ViewCount,
                Date = team.DateCreated.ToString("yyyy-MM-dd"),
                Visibility = team.Visibility,
                Tags = await GetTeamTags(team)
            };
            return teamPreviewDTO;
        }

        private async Task<UserPreviewDTO?> GetTeamPlayer(Team team)
        {
            if (team.PlayerId != null)
            {
                User player = await _userService.GetUserById(team.PlayerId);
                string? picture = player.Picture != null ? $"https://localhost:7134/images/sprites/profile-pics/{player.Picture}.png" : null;
                return new UserPreviewDTO(player.UserName, picture, true);
            }
            else if (team.AnonPlayer != null)
            {
                return new UserPreviewDTO(team.AnonPlayer);
            }
            return null;
        }

        private async Task<List<TagDTO>> GetTeamTags(Team team)
        {
            List<TagDTO> tags = new List<TagDTO>();
            List<TeamTag> teamTags = _pokeTeamContext.TeamTag.Where(t => t.TeamsId == team.Id).ToList();

            foreach (TeamTag teamTag in teamTags)
            {
                Tag tag = _pokeTeamContext.Tag.FirstOrDefault(t => t.Identifier == teamTag.TagsIdentifier);
                if (tag != null)
                {
                    TagDTO tagDTO = new TagDTO(tag.Name, tag.Identifier, description: tag.Description, color: tag.Color);
                    tags.Add(tagDTO);
                }
            }
            return tags;
        }

        public async Task<TeamDTO?> GetTeam(string id, int langId)
        {
            TeamDTO teamDTO = null;
            try
            {
                Team team = _pokeTeamContext.Team.FirstOrDefault(t => t.Id == id);
                teamDTO = await BuildTeamDTO(team, langId);
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return null;
            }
            return teamDTO;
        }

        public async Task<Team?> GetTeamModel(string id)
        {
            try
            {
                Team? team = await _pokeTeamContext.Team
                    .Include(t => t.Player)
                    .Include(t => t.Pokemons)
                    .Include(t => t.Tags)
                    .FirstOrDefaultAsync(t => t.Id == id);
                return team;
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return null;
            }
        }

        public async Task<TeamDataDTO?> GetTeamData(string id, int langId)
        {
            TeamDataDTO teamDataDTO = null;
            Team team = _pokeTeamContext.Team.FirstOrDefault(t => t.Id == id);
            if (team != null)
            {
                List<Pokemon> pokemons = _pokeTeamContext.Pokemon.Where(p => p.TeamId.Equals(team.Id)).ToList();
                TeamOptionsDTO teamOptionsDTO = new TeamOptionsDTO(team.IVsVisibility, team.EVsVisibility, team.NaturesVisibility);
                var test = _identityService.GetUserID();
                if (team.PlayerId != null && team.PlayerId == _identityService.GetUserID())
                {
                    teamOptionsDTO.Logged();
                }
                teamDataDTO = new TeamDataDTO(
                    team.Id,
                    pokemons.Select(p => p.Id).ToList(),
                    await GetTeamPlayer(team),
                    await _tournamentService.GetTournamentByNormalizedName(team.TournamentNormalizedName),
                    await _regulationService.GetRegulationByIdentifier(team.Regulation),
                    team.RentalCode,
                    team.ViewCount,
                    team.DateCreated.ToString("yyyy-MM-dd"),
                    team.Visibility,
                    await GetTeamTags(team),
                    teamOptionsDTO
                    );
            }
            return teamDataDTO;
        }

        public async Task<PokemonDTO?> GetPokemonById(int id, int langId)
        {
            Pokemon? pokemon = _pokeTeamContext.Pokemon.Include(p => p.Team).FirstOrDefault(p => p.Id == id);
            if (pokemon != null)
            {
                TeamOptionsDTO teamOptionsDTO = new TeamOptionsDTO(pokemon.Team.IVsVisibility, pokemon.Team.EVsVisibility, pokemon.Team.NaturesVisibility);
                if (pokemon.Team.PlayerId != null && pokemon.Team.PlayerId == _identityService.GetUserID())
                {
                    teamOptionsDTO.Logged();
                }
                return await _pokedexService.BuildPokemonDTO(pokemon, langId, teamOptionsDTO);
            }
            return null;
        }

        public async Task<PokemonPreviewDTO?> GetPokemonPreviewById(int id, int langId)
        {
            Pokemon? pokemon = _pokeTeamContext.Pokemon.FirstOrDefault(t => t.Id == id);
            if (pokemon != null)
            {
                return await _pokedexService.BuildPokemonPreviewDTO(pokemon, langId);
            }
            return null;
        }

        public async Task<List<PokemonPreviewDTO>> GetTeamPreviewPokemons(string id, int langId)
        {
            List<PokemonPreviewDTO> pokemonPreviewDTOs = new List<PokemonPreviewDTO>();

            Team team = _pokeTeamContext.Team.FirstOrDefault(t => t.Id == id);
            if (team != null)
            {
                List<Pokemon> pokemons = _pokeTeamContext.Pokemon.Where(p => p.TeamId.Equals(team.Id)).ToList();
                List<int> pokemonIds = pokemons.Select(p => p.Id).ToList();

                foreach (int pokemonId in pokemonIds)
                {
                    PokemonPreviewDTO pokemonPreviewDTO = await GetPokemonPreviewById(pokemonId, langId);
                    if (pokemonPreviewDTO != null)
                    {
                        pokemonPreviewDTOs.Add(pokemonPreviewDTO);
                    }
                }
            }

            return pokemonPreviewDTOs;
        }

        public string? ValidateTeamDTO(TeamDTO inputTeam)
        {
            if (inputTeam == null)
            {
                return "Error uploading team";
            }
            if (inputTeam.Player != null && inputTeam.Player.Username != null
                && inputTeam.Player.Username.Length > 32)
            {
                return "Player name must be shorter than 32 characters";
            }
            if (inputTeam.RentalCode != null
                && inputTeam.RentalCode.Length > 32)
            {
                return "Rental code must be shorter than 32 characters";
            }
            if (!inputTeam.Tags.IsNullOrEmpty()
                && inputTeam.Tags.Any(t => t != null
                && (t.Name.Length > 16
                || t.Identifier.Length > 16
                || (t.Description != null && t.Description.Length > 256)
                || (t.Color != null && t.Color.Length > 8))))
            {
                return "Tag validation error";
            }
            if (!inputTeam.Pokemons.IsNullOrEmpty()
                && inputTeam.Pokemons.Any(p => p != null 
                && ((p.Nickname != null && p.Nickname.Length > 16) 
                || (p.Notes != null && p.Notes.Length > 2048)
                || (p.Level != null && (p.Level < 1 || p.Level > 100)))))
            {
                return "Pokemon validation error";
            }
            return null;
        }

        public async Task<Team?> SaveTeam(TeamDTO inputTeam)
        {
            Team? newTeam = null;

            try
            {
                string teamId = GenerateId(10);
                Team? team = await _pokeTeamContext.Team.FindAsync(teamId);
                //loop maybe too ineficent? seek another way to get unused ids?
                //is there a way for sql server to auto generate custom ids?
                while (team != null)
                {
                    teamId = GenerateId(10);
                    team = await _pokeTeamContext.Team.FindAsync(teamId);
                }

                newTeam = await BreakTeamDTO(inputTeam, teamId);
                if (newTeam != null)
                {
                    await _pokeTeamContext.Team.AddAsync(newTeam);
                    await _pokeTeamContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Printer.Log("Exception in team upload", ex);
                return null;
            }
            return newTeam;
        }

        public async Task<Team?> BreakTeamDTO(TeamDTO inputTeam, string newTeamId)
        {
            Team newTeam = null;
            if (inputTeam != null)
            {
                List<Pokemon> pokemons = new List<Pokemon>();
                foreach (PokemonDTO pokemonDTO in inputTeam.Pokemons)
                {
                    pokemons.Add(BreakPokemonDTO(pokemonDTO, newTeamId));
                }

                User? loggedUser = await _identityService.GetUser();
                User? player = null;
                if (inputTeam.Player != null && inputTeam.Player.Username != null && loggedUser != null && loggedUser.UserName == inputTeam.Player.Username)
                {
                    player = loggedUser;
                }

                List<Tag> tags = new List<Tag>();
                if (inputTeam.Tags != null && inputTeam.Tags.Count > 0)
                {
                    foreach (TagDTO tagDTO in inputTeam.Tags)
                    {
                        Tag? tag = await _pokeTeamContext.Tag.FindAsync(tagDTO.Identifier);
                        if (tag == null)
                        {
                            tag = new Tag()
                            {
                                Identifier = Formatter.NormalizeString(tagDTO.Name),
                                Name = tagDTO.Name,
                                Description = tagDTO.Description,
                                Color = tagDTO.Color,
                            };
                        }
                        tags.Add(tag);
                    }
                }

                Tournament? tournament = null;
                if (inputTeam.Tournament != null && inputTeam.Tournament.Name != null)
                {
                    tournament = await _pokeTeamContext.Tournament.FindAsync(Formatter.NormalizeString(inputTeam.Tournament.Name));
                    if (tournament == null)
                    {
                        tournament = new Tournament(inputTeam.Tournament);
                    }
                }

                newTeam = new Team(
                    id: newTeamId,
                    pokemons: pokemons,
                    playerId: player != null ? player.Id : null,
                    anonPlayer: (player == null && inputTeam.Player != null) ? inputTeam.Player.Username : null,
                    tournamentNormalizedName: tournament != null ? tournament.NormalizedName : null,
                    tournament: tournament,
                    regulation: inputTeam.Regulation != null ? inputTeam.Regulation.Identifier : null,
                    tags: tags,
                    rentalCode: inputTeam.RentalCode,
                    viewCount: inputTeam.ViewCount,
                    dateCreated: inputTeam.Date != null && inputTeam.Date != "" ? DateTime.Parse(inputTeam.Date) : DateTime.Now,
                    visibility: player == null ? true : inputTeam.Visibility,
                    ivsVisibilty: player == null ? true : inputTeam.Options != null ? inputTeam.Options.IvsVisibility : false,
                    evsVisibilty: player == null ? true : inputTeam.Options != null ? inputTeam.Options.EvsVisibility : false,
                    naturesVisibilty: player == null ? true : inputTeam.Options != null ? inputTeam.Options.NaturesVisibility : false
                    );
            }
            return newTeam;
        }

        public Pokemon BreakPokemonDTO(PokemonDTO pokemonDTO, string teamId)
        {
            JsonSerializerOptions options = new JsonSerializerOptions { IncludeFields = false };

            string? serializedIVs = null;
            string? serializedEVs = null;
            try
            {
                serializedIVs = pokemonDTO.ivs != null ? JsonSerializer.Serialize(pokemonDTO.ivs, options) : null;
                serializedEVs = pokemonDTO.evs != null ? JsonSerializer.Serialize(pokemonDTO.evs, options) : null;
            }
            catch (Exception ex)
            {
                Printer.Log("Error serializing ivs/evs on team upload ", ex);
            }
            return new Pokemon
            {
                TeamId = teamId,
                DexNumber = pokemonDTO.DexNumber,
                Nickname = pokemonDTO.Nickname,
                Type1Identifier = pokemonDTO.Types.Type1?.Identifier,
                Type2Identifier = pokemonDTO.Types.Type2?.Identifier,
                TeraTypeIdentifier = pokemonDTO.TeraType?.Identifier,
                ItemIdentifier = pokemonDTO.Item?.Identifier,
                AbilityIdentifier = pokemonDTO.Ability?.Identifier,
                NatureIdentifier = pokemonDTO.Nature?.Identifier,
                Move1Identifier = pokemonDTO.Moves[0]?.Identifier,
                Move2Identifier = pokemonDTO.Moves[1]?.Identifier,
                Move3Identifier = pokemonDTO.Moves[2]?.Identifier,
                Move4Identifier = pokemonDTO.Moves[3]?.Identifier,
                Level = pokemonDTO.Level,
                Shiny = pokemonDTO.Shiny,
                Gender = pokemonDTO.Gender,
                Notes = pokemonDTO.Notes,
                IV_hp = pokemonDTO.ivs?[0]?.Value,
                IV_atk = pokemonDTO.ivs?[1]?.Value,
                IV_def = pokemonDTO.ivs?[2]?.Value,
                IV_spa = pokemonDTO.ivs?[3]?.Value,
                IV_spd = pokemonDTO.ivs?[4]?.Value,
                IV_spe = pokemonDTO.ivs?[5]?.Value,
                EV_hp = pokemonDTO.evs?[0]?.Value,
                EV_atk = pokemonDTO.evs?[1]?.Value,
                EV_def = pokemonDTO.evs?[2]?.Value,
                EV_spa = pokemonDTO.evs?[3]?.Value,
                EV_spd = pokemonDTO.evs?[4]?.Value,
                EV_spe = pokemonDTO.evs?[5]?.Value
            };
        }

        public async Task<Team?> UpdateTeam(TeamDTO inputTeam, string currentTeamID)
        {
            Team? newTeam = null;
            try
            {
                newTeam = await BreakTeamDTO(inputTeam, currentTeamID);
                if (newTeam != null)
                {
                    Team? currentTeam = await GetTeamModel(currentTeamID);
                    UpdateTeamProperties(currentTeam, newTeam);
                    await _pokeTeamContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Printer.Log("Exception in team update", ex);
                return null;
            }
            return newTeam;
        }

        public bool UpdateTeamProperties(Team currentTeam, Team newTeam)
        {
            try
            {
                currentTeam.Id = newTeam.Id;
                currentTeam.Pokemons = newTeam.Pokemons;
                currentTeam.PlayerId = newTeam.PlayerId;
                currentTeam.AnonPlayer = newTeam.AnonPlayer;
                currentTeam.TournamentNormalizedName = newTeam.TournamentNormalizedName;
                currentTeam.Tournament = newTeam.Tournament;
                currentTeam.Regulation = newTeam.Regulation;
                currentTeam.Tags = newTeam.Tags;
                currentTeam.ViewCount = newTeam.ViewCount;
                currentTeam.DateCreated = newTeam.DateCreated;
                currentTeam.Visibility = newTeam.Visibility;
                currentTeam.RentalCode = newTeam.RentalCode;
                return true;
            }
            catch (Exception ex)
            {
                Printer.Log("Exception in team update", ex);
                return false;
            }
        }

        public async Task<bool> DeleteTeam(Team team)
        {
            try
            {
                if (team != null)
                {
                    _pokeTeamContext.Team.Remove(team);
                    _pokeTeamContext.SaveChanges();
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                Printer.Log("Exception in: DeleteUserByUserName(string userName)");
                Printer.Log(ex);
                return false;
            }
            return true;
        }

        public async Task<bool> DeleteTeamById(string teamId)
        {
            try
            {
                Team team = await _pokeTeamContext.Team.FindAsync(teamId);
                if (team != null)
                {
                    _pokeTeamContext.Team.Remove(team);
                    _pokeTeamContext.SaveChanges();
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                Printer.Log("Exception in: DeleteUserByUserName(string userName)");
                Printer.Log(ex);
                return false;
            }
            return true;
        }

        public string GenerateId(int length)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<bool> DeleteUserTeams(User user)
        {
            Printer.Log("Deleting teams of: ", user.UserName);
            try
            {
                List<Team> userTeams = _pokeTeamContext.Team.Where(t => t.PlayerId == user.Id).ToList();
                if (userTeams.Count > 0)
                {
                    foreach (Team team in userTeams)
                    {
                        await DeleteTeamById(team.Id);
                    }
                }
                //_pokeTeamContext.Team.Where(t => t.PlayerId == user.Id).ForEachAsync(async t => await DeleteTeam(t.Id));
            }
            catch (Exception ex)
            {
                Printer.Log("Exception in: DeleteUserByUserName(string userName)");
                Printer.Log(ex);
            }
            return false;
        }

        public async Task<string> IncrementTeamViewCount(string teamKey)
        {
            try
            {
                Team team = await _pokeTeamContext.Team.FindAsync(teamKey);
                if (team == null) { return "Team not found"; }
                team.ViewCount++;
                _pokeTeamContext.SaveChanges();
            }
            catch (Exception ex)
            {
                Printer.Log("Exception in: DeleteUserByUserName(string userName)");
                Printer.Log(ex);
                return "Failed to increment team";
            }
            return "Team incremented";
        }

        private async Task<TeamSearchQueryResponseDTO> BuildTeamSearchQueryResponse(TeamSearchQueryDTO searchQuery, List<Team> teams, int langId)
        {
            List<TeamPreviewDTO?> teamsPreviews = new List<TeamPreviewDTO?>();
            List<Task<TeamPreviewDTO>> teamsPreviewBuilds = new List<Task<TeamPreviewDTO>>();

            int totalTeams = teams.Count;

            if (searchQuery.SortOrder != null)
            {
                teams = SortTeams(teams, searchQuery.SortOrder ?? null);
            }
            if (teams != null && teams.Count > 0 && searchQuery.TeamsPerPage != null && searchQuery.SelectedPage != null)
            {
                teams = ChunkTeams(teams, searchQuery.TeamsPerPage ?? 0, searchQuery.SelectedPage ?? 0);
            }

            foreach (Team team in teams)
            {
                teamsPreviews.Add(await BuildTeamPreviewDTO(team, langId));
            }

            return new TeamSearchQueryResponseDTO
            {
                Teams = teamsPreviews,
                TotalTeams = totalTeams
            };
        }

        public List<Team> SortTeams(List<Team> teams, SortOrder? order)
        {
            List<Team> sortedTeams = teams.ToList();
            if (order.Type == SortType.Date)
            {
                if (order.Way == SortWay.Ascending)
                {
                    sortedTeams = teams.OrderBy(t => t.DateCreated).ToList();
                }
                else if (order.Way == SortWay.Descending)
                {
                    sortedTeams = teams.OrderByDescending(t => t.DateCreated).ToList();
                }
            }
            else if (order.Type == SortType.Views)
            {
                if (order.Way == SortWay.Ascending)
                {
                    sortedTeams = teams.OrderBy(t => t.ViewCount).ToList();
                }
                else if (order.Way == SortWay.Descending)
                {
                    sortedTeams = teams.OrderByDescending(t => t.ViewCount).ToList();
                }
            }
            return sortedTeams;
        }

        public List<Team> ChunkTeams(List<Team> inteams, int teamsPerPage, int selectedPage)
        {
            try
            {
                return inteams.Chunk(teamsPerPage).ToArray()[selectedPage - 1].ToList();
            }
            catch (Exception ex)
            {
                Printer.Log($"Error chunking teams: teamsperpage {teamsPerPage}, selectedpage {selectedPage}", ex);
                return inteams.Chunk(teamsPerPage).ToArray()[0].ToList();
            }
        }

        public string? ValidateTeamSearchQueryDTO(TeamSearchQueryDTO searchQuery)
        {
            if(searchQuery == null)
            {
                return "Query not found";
            }
            if (searchQuery.TeamsPerPage == null || searchQuery.TeamsPerPage < 0 || searchQuery.TeamsPerPage > 100)
            {
                return "Wrong teams per page";
            }
            if (!searchQuery.Queries.IsNullOrEmpty() && searchQuery.Queries.Any(q => q.Type == "user" && q.Name.Length > 32))
            {
                return "Player name must be shorter than 32 characters";
            }
            if (!searchQuery.Queries.IsNullOrEmpty() && searchQuery.Queries.Any(q => q.Type == "tournament" && q.Name.Length > 256))
            {
                return "Tournament name must be shorter than 32 characters";
            }
            return null;
        }

        public async Task<TeamSearchQueryResponseDTO> QueryTeams(TeamSearchQueryDTO searchQuery, int langId)
        {
            List<TeamPreviewDTO> teamsPreviews = new List<TeamPreviewDTO>();
            List<Team> teams = new List<Team>();
            try
            {
                teams = _pokeTeamContext.Team
                    .Include(t => t.Pokemons)
                    .Include(t => t.Player)
                    .Include(t => t.Tournament)
                    .Include(t => t.Tags)
                    .ToList();

                User? loggedUser = await _identityService.GetUser();
                if (loggedUser != null)
                {
                    teams = teams.Where(t => ((t.Player == null || t.Player.Visibility) && t.Visibility)
                        || (t.PlayerId != null && t.PlayerId == loggedUser.Id)).ToList();
                }
                else
                {
                    //Only cut teams where player is private or team is private
                    teams = teams.Where(t => (t.Player == null || t.Player.Visibility) && t.Visibility).ToList();
                }

                if (searchQuery.Queries != null && searchQuery.Queries.Count > 0)
                {
                    List<Expression<Func<Team, bool>>> expressions = await GetExpressions(searchQuery);
                    Expression<Func<Team, bool>>? joinedExpressions = null;
                    //Union -> all teams that match any
                    if (searchQuery.SetOperation != null && searchQuery.SetOperation.Equals("union"))
                    {
                        joinedExpressions = JoinExpressionsOr(expressions);
                    }
                    //Default option
                    //Intersection -> only teams that match all
                    else
                    {
                        joinedExpressions = JoinExpressionsAnd(expressions);
                    }

                    if (joinedExpressions != null)
                    {
                        teams = teams.AsQueryable().Where(joinedExpressions).ToList();
                    }
                }

                teams = teams.Distinct().ToList();
            }
            catch (Exception ex)
            {
                Printer.Log("Error querying teams ", ex);
                return await BuildTeamSearchQueryResponse(searchQuery, [], langId);
            }

            return await BuildTeamSearchQueryResponse(searchQuery, teams, langId);
        }

        public async Task<List<Expression<Func<Team, bool>>>> GetExpressions(TeamSearchQueryDTO searchQuery)
        {
            List<Expression<Func<Team, bool>>> expressions = new List<Expression<Func<Team, bool>>>();

            if (searchQuery.Queries != null && searchQuery.Queries.Count > 0)
            {
                foreach (QueryResultDTO query in searchQuery.Queries)
                {
                    switch (query.Type)
                    {
                        case "user":
                            User user = await _userService.GetUserByUserName(query.Name);
                            if (user != null)
                            {
                                expressions.Add(t => t.PlayerId == user.Id);
                            }
                            else
                            {
                                expressions.Add(t => t.AnonPlayer != null && t.AnonPlayer.Contains(query.Name));
                            }
                            break;
                        case "tournament":
                            expressions.Add(t => t.Tournament != null && t.Tournament.NormalizedName == query.Name.ToUpper());
                            break;
                        case "regulation":
                            expressions.Add(t => t.Regulation == query.Identifier);
                            break;
                        case "tag":
                            expressions.Add(t => t.Tags.Any(t => t.Name == query.Name));
                            break;
                        case "pokemon":
                            expressions.Add(t => t.Pokemons.Any(p => p.DexNumber == int.Parse(query.Identifier)));
                            break;
                        case "move":
                            expressions.Add(t => t.Pokemons.Any(p => p.Move1Identifier == query.Identifier
                                || p.Move2Identifier == query.Identifier
                                || p.Move3Identifier == query.Identifier
                                || p.Move4Identifier == query.Identifier));
                            break;
                        case "item":
                            expressions.Add(t => t.Pokemons.Any(p => p.ItemIdentifier == query.Identifier));
                            break;
                    }
                }
            }
            return expressions;
        }

        public Expression<Func<Team, bool>>? JoinExpressionsAnd(List<Expression<Func<Team, bool>>> expressions)
        {
            Expression<Func<Team, bool>>? joinedExpressions = null;
            foreach (var expression in expressions)
            {
                if (expression != null)
                {
                    joinedExpressions = joinedExpressions == null ? expression : PredicateBuilder.And(joinedExpressions, expression);
                }
            }
            return joinedExpressions;
        }

        public Expression<Func<Team, bool>>? JoinExpressionsOr(List<Expression<Func<Team, bool>>> expressions)
        {
            Expression<Func<Team, bool>>? joinedExpressions = null;
            foreach (var expression in expressions)
            {
                if (expression != null)
                {
                    joinedExpressions = joinedExpressions == null ? expression : PredicateBuilder.Or(joinedExpressions, expression);
                }
            }
            return joinedExpressions;
        }
    }
}
