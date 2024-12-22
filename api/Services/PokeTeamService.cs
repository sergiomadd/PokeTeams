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

namespace api.Services
{
    public class PokeTeamService : IPokeTeamService
    {
        private readonly PokeTeamContext _pokeTeamContext;
        private readonly IPokedexService _pokedexService;
        private readonly IUserService _userService;
        private readonly ITournamentService _tournamentService;
        private readonly IRegulationService _regulationService;

        private readonly UserManager<User> _userManager;


        private static Random random = new Random();

        public PokeTeamService
            (
                PokeTeamContext dataContext,
                IPokedexService pokedexService,
                IUserService userService,
                ITournamentService tournamentService,
                IRegulationService regulationService,
                UserManager<User> userManager
            )
        {
            _pokeTeamContext = dataContext;
            _pokedexService = pokedexService;
            _userService = userService;
            _tournamentService = tournamentService;
            _regulationService = regulationService;
            _userManager = userManager;

        }

        public async Task<TeamDTO?> BuildTeamDTO(Team team, int langId)
        {
            TeamDTO teamDTO = null;
            if (team != null)
            {
                List<Pokemon> pokemons = _pokeTeamContext.Pokemon.Where(p => p.TeamId.Equals(team.Id)).ToList();
                List<PokemonDTO> pokemonDTOs = new List<PokemonDTO>();

                foreach (Pokemon pokemon in pokemons)
                {
                    pokemonDTOs.Add(await _pokedexService.BuildPokemonDTO(pokemon, langId));
                }

                teamDTO = new TeamDTO(
                    team.Id,
                    pokemonDTOs,
                    team.Options,
                    await GetTeamPlayer(team),
                    await _tournamentService.GetTournamentByName(team.TournamentNormalizedName),
                    await _regulationService.GetRegulationByIdentifier(team.Regulation),
                    team.ViewCount,
                    team.DateCreated.ToString("yyyy-MM-dd"),
                    team.Visibility,
                    await GetTeamTags(team)
                    );
            }
            return teamDTO;
        }

        public async Task<TeamPreviewDTO?> BuildTeamPreviewDTO(Team team, int langId)
        {
            TeamPreviewDTO teamPreviewDTO = null;
            List<Pokemon> pokemons = _pokeTeamContext.Pokemon.Where(p => p.TeamId.Equals(team.Id)).ToList();
            List<PokemonPreviewDTO> pokemonPreviewDTOs = new List<PokemonPreviewDTO>();

            TeamOptionsDTO editorOptions = JsonSerializer.Deserialize<TeamOptionsDTO?>(team.Options, new JsonSerializerOptions { IncludeFields = false });

            foreach (Pokemon pokemon in pokemons)
            {
                pokemonPreviewDTOs.Add(await _pokedexService.BuildPokemonPreviewDTO(pokemon, editorOptions, langId));
            }

            teamPreviewDTO = new TeamPreviewDTO
            {
                ID = team.Id,
                Pokemons = pokemonPreviewDTOs,
                Options = JsonSerializer.Deserialize<TeamOptionsDTO>(team.Options, new JsonSerializerOptions { IncludeFields = false }),
                Player = await GetTeamPlayer(team),
                Tournament = await _tournamentService.GetTournamentByName(team.TournamentNormalizedName),
                Regulation = await _regulationService.GetRegulationByIdentifier(team.Regulation),
                ViewCount = team.ViewCount,
                Date = team.DateCreated.ToString("yyyy-MM-dd"),
                Visibility = team.Visibility,
                Tags = await GetTeamTags(team)
            };
            return teamPreviewDTO;
        }

        private async Task<UserPreviewDTO> GetTeamPlayer(Team team)
        {
            UserPreviewDTO playerUserName = new UserPreviewDTO();
            if (team.PlayerId != null)
            {
                User player = await _userService.GetUserById(team.PlayerId);
                playerUserName.Username = player.UserName;
                playerUserName.Picture = $"https://localhost:7134/images/sprites/profile-pics/{player.Picture}.png";
            }
            else if (team.AnonPlayer != null)
            {
                playerUserName.Username = team.AnonPlayer;
                playerUserName.Picture = $"https://localhost:7134/images/sprites/profile-pics/anonymous.png";
            }
            return playerUserName;
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

        public async Task<Team?> SaveTeam(TeamDTO inputTeam, string loggedUserName)
        {
            Team newTeam = null;
            string teamId = GenerateId(10);
            try
            {
                Team team = await _pokeTeamContext.Team.FindAsync(teamId);
                //loop maybe too ineficent? seek another way to get unused ids?
                //is there a way for sql server to auto generate custom ids?
                while (team != null)
                {
                    teamId = GenerateId(10);
                    team = await _pokeTeamContext.Team.FindAsync(teamId);
                }
                List<Pokemon> pokemons = new List<Pokemon>();
                foreach (PokemonDTO pokemonDTO in inputTeam.Pokemons)
                {
                    pokemons.Add(BreakPokemonDTO(pokemonDTO, teamId));
                }

                JsonSerializerOptions options = new JsonSerializerOptions { IncludeFields = false };
                string optionsString = JsonSerializer.Serialize(inputTeam.Options, options);

                User player = null;
                if (inputTeam.Player != null && inputTeam.Player.Username != null && loggedUserName == inputTeam.Player.Username)
                {
                    player = await _userService.GetUserByUserName(inputTeam.Player.Username);
                }

                List<Tag> tags = new List<Tag>();
                if (inputTeam.Tags != null && inputTeam.Tags.Count > 0)
                {
                    foreach (TagDTO tagDTO in inputTeam.Tags)
                    {
                        Tag? tag = await _pokeTeamContext.Tag.FindAsync(tagDTO.Identifier);
                        if(tag == null) 
                        {
                            tag = new Tag()
                            {
                                Identifier = tagDTO.Identifier,
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
                    if(tournament == null)
                    {
                        tournament = new Tournament(inputTeam.Tournament);
                    }
                }

                newTeam = new Team
                {
                    Id = teamId,
                    Pokemons = pokemons,
                    Options = optionsString,
                    PlayerId = player != null ? player.Id : null,
                    AnonPlayer = player == null ? inputTeam.Player != null ? inputTeam.Player.Username : "anon" : null,
                    TournamentNormalizedName = tournament != null ? tournament.NormalizedName : null,
                    Tournament = tournament,
                    Regulation = inputTeam.Regulation != null ? inputTeam.Regulation.Identifier : null,
                    ViewCount = 0,
                    Visibility = inputTeam.Visibility,
                    Tags = tags,
                };
                await _pokeTeamContext.Team.AddAsync(newTeam);
                await _pokeTeamContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Printer.Log("Exception in team upload", ex.Message);
                return null;
            }
            return newTeam;
        }

        public Pokemon BreakPokemonDTO(PokemonDTO pokemonDTO, string teamId)
        {
            JsonSerializerOptions options = new JsonSerializerOptions { IncludeFields = true };

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
                ivs = serializedIVs,
                evs = serializedEVs,
                Level = pokemonDTO.Level,
                Shiny = pokemonDTO.Shiny,
                Gender = pokemonDTO.Gender,
                Notes = pokemonDTO.Notes,
            };
        }

        public async Task<bool> DeleteTeam(string teamId)
        {
            Printer.Log("Deleting team: ", teamId);
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
                        await DeleteTeam(team.Id);
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
        [Time]
        private async Task<TeamSearchQueryResponseDTO> BuildTeamSearchQueryResponse(TeamSearchQueryDTO searchQuery, List<Team> teams, int langId)
        {
            List<TeamPreviewDTO> teamsPreviews = new List<TeamPreviewDTO>();
            List<Task<TeamPreviewDTO>> teamsPreviewBuilds = new List<Task<TeamPreviewDTO>>();

            int totalTeams = teams.Count;

            if (searchQuery.SortOrder != null)
            {
                teams = SortTeams(teams, searchQuery.SortOrder ?? null);
            }
            if (teams != null && teams.Count > 0
                && searchQuery.TeamsPerPage != null && searchQuery.SelectedPage != null)
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
        [Time]
        public async Task<TeamSearchQueryResponseDTO> QueryTeams(TeamSearchQueryDTO searchQuery, int langId)
        {
            List<TeamPreviewDTO> teamsPreviews = new List<TeamPreviewDTO>();
            List<Team> teams = new List<Team>();
            if(searchQuery.Queries != null && searchQuery.Queries.Count > 0)
            {
                foreach (TagDTO query in searchQuery.Queries)
                {
                    if(searchQuery.SetOperation.Equals("union"))
                    {
                        //Union -> all teams that match any
                        switch (query.Type)
                        {
                            case "username":
                                teams.AddRange(await FilterTeamsByPlayer(teams, query.Name));
                                break;
                            case "tournament":
                                teams.AddRange(FilterTeamsByTournament(teams, query.Name));
                                break;
                            case "regulation":
                                teams.AddRange(FilterTeamsByRegulation(teams, query.Name));
                                break;
                            case "tag":
                                teams.AddRange(FilterTeamsByTag(teams, query.Name));
                                break;
                            case "pokemon":
                                teams.AddRange(FilterTeamsByPokemons(teams, query.Identifier));
                                break;
                            case "move":
                                teams.AddRange(FilterTeamsByMoves(teams, query.Identifier));
                                break;
                            case "item":
                                teams.AddRange(FilterTeamsByItems(teams, query.Identifier));
                                break;
                        }
                    }
                    else
                    {
                        //Default option
                        //Intersection -> only teams that match all
                        switch (query.Type)
                        {
                            case "username":
                                teams = await FilterTeamsByPlayer(teams, query.Name);
                                break;
                            case "tournament":
                                teams = FilterTeamsByTournament(teams, query.Name);
                                break;
                            case "regulation":
                                teams = FilterTeamsByRegulation(teams, query.Name);
                                break;
                            case "tag":
                                teams = FilterTeamsByTag(teams, query.Name);
                                break;
                            case "pokemon":
                                teams = FilterTeamsByPokemons(teams, query.Identifier);
                                break;
                            case "move":
                                teams = FilterTeamsByMoves(teams, query.Identifier);
                                break;
                            case "item":
                                teams = FilterTeamsByItems(teams, query.Identifier);
                                break;
                        }
                    }
                }
            }
            else
            {
                teams = _pokeTeamContext.Team.ToList();
            }

            return await BuildTeamSearchQueryResponse(searchQuery, teams.Distinct().ToList(), langId);
        }

        public List<Team> SortTeams(List<Team> teams , SortOrder? order)
        {
            List<Team> sortedTeams = teams.ToList();
            if(order.Type == SortType.Date)
            {
                if(order.Way == SortWay.Ascending)
                {
                    sortedTeams = teams.OrderBy(t => t.DateCreated).ToList();
                }
                else if(order.Way == SortWay.Descending)
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

        public async Task<List<Team>> FilterTeamsByPlayer(List<Team> inteams, string username)
        {
            User user = await _userService.GetUserByUserName(username);
            try
            {
                if (inteams.Count == 0)
                {
                    if (user != null)
                    {
                        inteams = _pokeTeamContext.Team
                            .Include(t => t.Pokemons)
                            .Include(t => t.Tags)
                            .Where(t => t.PlayerId == user.Id).ToList();
                    }
                    else
                    {
                        inteams = _pokeTeamContext.Team
                            .Include(t => t.Pokemons)
                            .Include(t => t.Tags)
                            .Where(t => t.AnonPlayer.Contains(username)).ToList();
                    }
                }
                else
                {
                    if (user != null)
                    {
                        inteams = inteams.Where(t => t.PlayerId == user.Id).ToList();
                    }
                    else
                    {
                        inteams = inteams.Where(t => t.AnonPlayer.Contains(username)).ToList();
                    }
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex.ToString());
            }
            return inteams;
        }

        public List<Team> FilterTeamsByTournament(List<Team> inteams, string tournamentName)
        {
            try
            {
                if (inteams.Count == 0)
                {
                    inteams = _pokeTeamContext.Team
                        .Include(t => t.Pokemons)
                        .Include(t => t.Tags)
                        .Include(t => t.Tournament)
                        .Where(t => t.Tournament.Name == tournamentName).ToList();
                }
                else
                {
                    inteams = inteams.Where(t => t.Tournament.Name == tournamentName).ToList();
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex.ToString());
            }
            return inteams;
        }

        public List<Team> FilterTeamsByRegulation(List<Team> inteams, string regulationIdentifier)
        {
            try
            {
                if (inteams.Count == 0)
                {
                    inteams = _pokeTeamContext.Team
                        .Include(t => t.Pokemons)
                        .Include(t => t.Tags)
                        .Include(t => t.Tournament)
                        .Where(t => t.Regulation == regulationIdentifier).ToList();
                }
                else
                {
                    inteams = inteams.Where(t => t.Regulation == regulationIdentifier).ToList();
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex.ToString());
            }
            return inteams;
        }

        public List<Team> FilterTeamsByTag(List<Team> inteams, string tagName)
        {
            try
            {
                if (inteams.Count == 0)
                {
                    inteams = _pokeTeamContext.Team
                        .Include(t => t.Pokemons)
                        .Include(t => t.Tags)
                        .Include(t => t.Tournament)
                        .Where(t => t.Tags.Any(t => t.Name == tagName)).ToList();
                }
                else
                {
                    inteams = inteams.Where(t => t.Tags.Any(t => t.Name == tagName)).ToList();
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex.ToString());
            }
            return inteams;
        }

        public List<Team> FilterTeamsByPokemons(List<Team> inteams, string dexNumber)
        {
            try
            {
                if (inteams.Count == 0)
                {
                    inteams = _pokeTeamContext.Team
                        .Include(t => t.Pokemons)
                        .Include(t => t.Tags)
                        .Where(t => t.Pokemons.Any(p => p.DexNumber == int.Parse(dexNumber))).ToList();
                }
                else
                {
                    inteams = inteams.Where(t => t.Pokemons.Any(p => p.DexNumber == int.Parse(dexNumber))).ToList();
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex.ToString());
            }
            return inteams;
        }

        public List<Team> FilterTeamsByMoves(List<Team> inteams, string moveIdentifier)
        {
            try
            {
                if (inteams.Count == 0)
                {
                    inteams = _pokeTeamContext.Team
                        .Include(t => t.Pokemons)
                        .Include(t => t.Tags)
                        .Where(t => t.Pokemons.Any(p => p.Move1Identifier == moveIdentifier
                        || p.Move2Identifier == moveIdentifier
                        || p.Move3Identifier == moveIdentifier
                        || p.Move4Identifier == moveIdentifier)).ToList();
                }
                else
                {
                    inteams = inteams.Where(t => t.Pokemons.Any(p => p.Move1Identifier == moveIdentifier
                        || p.Move2Identifier == moveIdentifier
                        || p.Move3Identifier == moveIdentifier
                        || p.Move4Identifier == moveIdentifier)).ToList();
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex.ToString());
            }
            return inteams;
        }

        public List<Team> FilterTeamsByItems(List<Team> inteams, string itemIdentifier)
        {
            try
            {
                if (inteams.Count == 0)
                {
                    inteams = _pokeTeamContext.Team
                        .Include(t => t.Pokemons)
                        .Include(t => t.Tags)
                        .Where(t => t.Pokemons.Any(p => p.ItemIdentifier == itemIdentifier)).ToList();
                }
                else
                {
                    inteams = inteams.Where(t => t.Pokemons.Any(p => p.ItemIdentifier == itemIdentifier)).ToList();
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex.ToString());
            }
            return inteams;
        }

    }
}
