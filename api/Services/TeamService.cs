using api.Data;
using api.Models.DBPoketeamModels;
using System.Text.Json;
using api.Util;
using System.Data;
using Microsoft.EntityFrameworkCore;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using Microsoft.AspNetCore.Identity;
using System.Linq.Expressions;
using LinqKit;

namespace api.Services
{
    public class TeamService : ITeamService
    {
        private readonly PokeTeamContext _pokeTeamContext;
        private readonly IUserService _userService;
        private readonly IIdentityService _identityService;
        private readonly ITournamentService _tournamentService;
        private readonly IRegulationService _regulationService;
        private readonly IPokemonService _pokemonService;
        private readonly IConfiguration _config;
        private readonly Printer Printer;
        private string baseUrl;
        private static Random random = new Random();

        public TeamService
            (
                PokeTeamContext dataContext,
                UserManager<User> userManager,
                IUserService userService,
                IIdentityService identityService,
                ITournamentService tournamentService,
                IRegulationService regulationService,
                IPokemonService pokemonService,
                IConfiguration config,
                Printer printer
            )
        {
            _pokeTeamContext = dataContext;
            _userService = userService;
            _identityService = identityService;
            _tournamentService = tournamentService;
            _regulationService = regulationService;
            _pokemonService = pokemonService;
            _config = config;
            Printer = printer;

            baseUrl = "";
            string? baseUrlTemp = _config["BaseUrl"];
            if (baseUrlTemp != null)
            {
                baseUrl = (string)baseUrlTemp;
            }
        }

        public async Task<TeamDataDTO?> BuildTeamDataDTO(Team? team, int langId)
        {
            TeamDataDTO? teamDataDTO = null;
            if (team != null)
            {
                List<Pokemon> pokemons = await _pokeTeamContext.Pokemon.Where(p => p.TeamId.Equals(team.Id)).ToListAsync();
                TeamOptionsDTO teamOptionsDTO = new TeamOptionsDTO(team.IVsVisibility, team.EVsVisibility, team.NaturesVisibility);
                UserPreviewDTO? userPreview = null;
                if (team.PlayerId != null)
                {
                    User? teamPlayer = await _userService.GetUserById(team.PlayerId);
                    if (teamPlayer != null)
                    {
                        if (teamPlayer.Id == _identityService.GetLoggedUserID())
                        {
                            teamOptionsDTO.Logged();
                        }
                        else if (!teamPlayer.Visibility || !team.Visibility)
                        {
                            team.Id = "unauthorized";
                        }
                    }
                    string? picture = teamPlayer?.Picture != null ? $"{baseUrl}images/profile-pics/{teamPlayer.Picture}.png" : null;
                    userPreview = new UserPreviewDTO(teamPlayer?.UserName, picture, true);
                }
                else if (team.AnonPlayer != null)
                {
                    userPreview = new UserPreviewDTO(team.AnonPlayer);
                }

                teamDataDTO = new TeamDataDTO(
                    team.Id,
                    pokemons.Select(p => p.Id).ToList(),
                    userPreview,
                    team.TournamentNormalizedName != null ? await _tournamentService.GetTournamentByNormalizedName(team.TournamentNormalizedName) : null,
                    team.Regulation != null ? await _regulationService.GetRegulationByIdentifier(team.Regulation) : null,
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

        public async Task<TeamDTO?> BuildTeamDTO(Team? team, int langId)
        {
            TeamDTO? teamDTO = null;
            if (team != null)
            {
                TeamDataDTO? teamDataDTO = await BuildTeamDataDTO(team, langId);
                List<PokemonDTO> pokemonDTOs = new List<PokemonDTO>();
                if (teamDataDTO != null)
                {
                    if(teamDataDTO.PokemonIDs.Count > 0)
                    {
                        List<Pokemon> pokemons = await _pokeTeamContext.Pokemon.Where(p => p.TeamId.Equals(team.Id)).ToListAsync();
                        foreach (int pokemonId in teamDataDTO.PokemonIDs)
                        {
                            Pokemon? pokemon = await _pokeTeamContext.Pokemon.FindAsync(pokemonId);
                            if (pokemon != null)
                            {
                                pokemonDTOs.Add(await _pokemonService.BuildPokemonDTO(pokemon, langId, teamDataDTO.Options));
                            }
                        }
                    }
                    teamDTO = new TeamDTO(teamDataDTO, pokemonDTOs);
                }
            }
            return teamDTO;
        }

        public async Task<TeamPreviewDTO?> BuildTeamPreviewDTO(Team team, int langId)
        {
            TeamPreviewDTO? teamPreviewDTO = null;
            List<Pokemon> pokemons = await _pokeTeamContext.Pokemon.Where(p => p.TeamId.Equals(team.Id)).ToListAsync();
            List<int> pokemonPreviewIDs = new List<int>();

            foreach (Pokemon pokemon in pokemons)
            {
                pokemonPreviewIDs.Add(pokemon.Id);
            }

            UserPreviewDTO? userPreview = null;
            if (team.PlayerId != null)
            {
                User? teamPlayer = await _userService.GetUserById(team.PlayerId);
                if (teamPlayer != null)
                {
                    if ((!teamPlayer.Visibility || !team.Visibility) && teamPlayer.Id != _identityService.GetLoggedUserID())
                    {
                        team.Id = "unauthorized";
                    }
                }
                string? picture = teamPlayer?.Picture != null ? $"{baseUrl}images/profile-pics/{teamPlayer.Picture}.png" : null;
                userPreview = new UserPreviewDTO(teamPlayer?.UserName, picture, true);
            }
            else if (team.AnonPlayer != null)
            {
                userPreview = new UserPreviewDTO(team.AnonPlayer);
            }

            teamPreviewDTO = new TeamPreviewDTO
            {
                ID = team.Id,
                PokemonIDs = pokemonPreviewIDs,
                Player = userPreview,
                Tournament = team.TournamentNormalizedName != null ? await _tournamentService.GetTournamentByNormalizedName(team.TournamentNormalizedName) : null,
                Regulation = team.Regulation != null ? await _regulationService.GetRegulationByIdentifier(team.Regulation) : null,
                ViewCount = team.ViewCount,
                Date = team.DateCreated.ToString("yyyy-MM-dd"),
                Visibility = team.Visibility,
                Tags = await GetTeamTags(team)
            };
            return teamPreviewDTO;
        }

        public async Task<Team?> BreakTeamDTO(TeamDTO inputTeam, string newTeamId)
        {
            Team? newTeam = null;
            if (inputTeam != null && inputTeam.Pokemons != null && inputTeam.Pokemons.Any())
            {
                List<Pokemon> pokemons = new List<Pokemon>();
                foreach (PokemonDTO? pokemonDTO in inputTeam.Pokemons)
                {
                    if(pokemonDTO != null)
                    {
                        pokemons.Add(_pokemonService.BreakPokemonDTO(pokemonDTO, newTeamId));
                    }
                }

                User? loggedUser = await _identityService.GetLoggedUser();
                User? player = null;
                if (inputTeam.Player != null && inputTeam.Player.Username != null && loggedUser != null && loggedUser.UserName == inputTeam.Player.Username)
                {
                    player = loggedUser;
                }

                List<string> tagsIds = new List<string>();
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
                                Color = tagDTO.Color != null ? (int)tagDTO.Color : 0,
                            };
                            await _pokeTeamContext.Tag.AddAsync(tag);
                        }
                        string tagId = tag.Identifier;
                        tagsIds.Add(tagId);
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
                    tags: tagsIds,
                    rentalCode: inputTeam.RentalCode,
                    viewCount: inputTeam.ViewCount,
                    dateCreated: inputTeam.Date != null && inputTeam.Date != "" ? DateTime.Parse(inputTeam.Date).ToUniversalTime() : DateTime.UtcNow,
                    visibility: player == null ? true : inputTeam.Visibility,
                    ivsVisibilty: player == null ? true : inputTeam.Options != null ? inputTeam.Options.IvsVisibility : false,
                    evsVisibilty: player == null ? true : inputTeam.Options != null ? inputTeam.Options.EvsVisibility : false,
                    naturesVisibilty: player == null ? true : inputTeam.Options != null ? inputTeam.Options.NaturesVisibility : false
                    );
            }
            return newTeam;
        }

        public async Task<Team?> GetTeamModel(string id)
        {
            try
            {
                Team? team = await _pokeTeamContext.Team
                    .Include(t => t.Player)
                    .Include(t => t.Pokemons)
                    .FirstOrDefaultAsync(t => t.Id == id);
                return team;
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return null;
            }
        }

        public async Task<TeamDTO?> GetTeam(string id, int langId)
        {
            TeamDTO? teamDTO = null;
            try
            {
                Team? team = await _pokeTeamContext.Team.FirstOrDefaultAsync(t => t.Id == id);
                teamDTO = await BuildTeamDTO(team, langId);
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return null;
            }
            return teamDTO;
        }

        public async Task<TeamDataDTO?> GetTeamData(string id, int langId)
        {
            TeamDataDTO? teamDataDTO = null;
            try
            {
                Team? team = await _pokeTeamContext.Team.FirstOrDefaultAsync(t => t.Id == id);
                teamDataDTO = await BuildTeamDataDTO(team, langId);
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return null;
            }
            return teamDataDTO;
        }

        private async Task<List<TagDTO>> GetTeamTags(Team team)
        {
            List<TagDTO> tags = new List<TagDTO>();
            if(team.TagIds != null && team.TagIds.Count > 0)
            {
                foreach (string tadId in team.TagIds)
                {
                    Tag? tag = await _pokeTeamContext.Tag.FirstOrDefaultAsync(t => t.Identifier == tadId);
                    if (tag != null)
                    {
                        TagDTO tagDTO = new TagDTO(tag.Name, tag.Identifier, description: tag.Description, color: tag.Color);
                        tags.Add(tagDTO);
                    }
                }
            }

            return tags;
        }

        public async Task<Team?> SaveTeam(TeamDTO inputTeam)
        {
            Team? newTeam = null;

            try
            {
                //No need to check if id exitst (collision virtually imposible)
                string teamId = Generator.GenerateId(10);
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

        public async Task<Team?> UpdateTeam(TeamDTO inputTeam, string currentTeamID)
        {
            Team? newTeam = null;
            try
            {
                newTeam = await BreakTeamDTO(inputTeam, currentTeamID);
                if (newTeam != null)
                {
                    Team? currentTeam = await GetTeamModel(currentTeamID);
                    if(currentTeam != null)
                    {
                        UpdateTeamProperties(currentTeam, newTeam);
                        await _pokeTeamContext.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                Printer.Log("Exception in team update", ex);
                return null;
            }
            return newTeam;
        }

        private bool UpdateTeamProperties(Team currentTeam, Team newTeam)
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
                currentTeam.TagIds = newTeam.TagIds;
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
                    await _pokeTeamContext.SaveChangesAsync();
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex);
                return false;
            }
            return true;
        }

        public async Task<bool> DeleteTeamById(string teamId)
        {
            try
            {
                Team? team = await _pokeTeamContext.Team.FindAsync(teamId);
                if (team != null)
                {
                    _pokeTeamContext.Team.Remove(team);
                    await _pokeTeamContext.SaveChangesAsync();
                    return true;
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex);
            }
            return false;
        }

        public async Task<bool> DeleteUserTeams(User user)
        {
            try
            {
                List<Team> userTeams = await _pokeTeamContext.Team.Where(t => t.PlayerId == user.Id).ToListAsync();
                if (userTeams.Count > 0)
                {
                    foreach (Team team in userTeams)
                    {
                        await DeleteTeamById(team.Id);
                    }
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex);
            }
            return false;
        }

        public async Task<string> IncrementTeamViewCount(string teamKey)
        {
            try
            {
                Team? team = await _pokeTeamContext.Team.FindAsync(teamKey);
                if (team == null) { return "Team not found"; }
                team.ViewCount++;
                await _pokeTeamContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
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

        public async Task<TeamSearchQueryResponseDTO> QueryTeams(TeamSearchQueryDTO searchQuery, int langId)
        {
            List<TeamPreviewDTO> teamsPreviews = new List<TeamPreviewDTO>();
            List<Team> teams = new List<Team>();
            try
            {
                teams = await _pokeTeamContext.Team
                    .Include(t => t.Pokemons)
                    .Include(t => t.Player)
                    .Include(t => t.Tournament)
                    .ToListAsync();

                User? loggedUser = await _identityService.GetLoggedUser();
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

        private async Task<List<Expression<Func<Team, bool>>>> GetExpressions(TeamSearchQueryDTO searchQuery)
        {
            List<Expression<Func<Team, bool>>> expressions = new List<Expression<Func<Team, bool>>>();

            if (searchQuery.Queries != null && searchQuery.Queries.Count > 0)
            {
                foreach (QueryResultDTO query in searchQuery.Queries)
                {
                    if(query != null)
                    {
                        switch (query.Type)
                        {
                            case "user":
                                if(query.Name != null)
                                {
                                    User? user = await _userService.GetUserByUserName(query.Name);
                                    if (user != null)
                                    {
                                        expressions.Add(t => t.PlayerId == user.Id);
                                    }
                                    else
                                    {
                                        expressions.Add(t => t.AnonPlayer != null && t.AnonPlayer.Contains(query.Name));
                                    }
                                }
                                break;
                            case "tournament":
                                expressions.Add(t => t.Tournament != null && t.Tournament.ShortName == query.Name);
                                break;
                            case "regulation":
                                expressions.Add(t => t.Regulation == query.Identifier);
                                break;
                            case "tag":
                                expressions.Add(t => t.TagIds != null && t.TagIds.Any(t => query.Name != null && t == Formatter.NormalizeString(query.Name)));
                                break;
                            case "pokemon":
                                expressions.Add(t => t.Pokemons.Any(p => query.Identifier != null && p.DexNumber == int.Parse(query.Identifier))); 
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
            }
            return expressions;
        }

        private Expression<Func<Team, bool>>? JoinExpressionsAnd(List<Expression<Func<Team, bool>>> expressions)
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

        private Expression<Func<Team, bool>>? JoinExpressionsOr(List<Expression<Func<Team, bool>>> expressions)
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

        private List<Team> SortTeams(List<Team> teams, SortOrder? order)
        {
            List<Team> sortedTeams = teams.ToList();
            if(order == null)
            {
                order = new SortOrder()
                {
                    Type = SortType.Date,
                    Way = SortWay.Descending
                };
            }
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

        private List<Team> ChunkTeams(List<Team> inteams, int teamsPerPage, int selectedPage)
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

        public string? ValidateTeamDTO(TeamDTO? inputTeam)
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
            if (inputTeam.Tags != null && inputTeam.Tags.Any(t => t != null
                && (t.Name.Length > 16
                || t.Identifier.Length > 16
                || (t.Description != null && t.Description.Length > 256)
                || (t.Color != null && t.Color > 32))))
            {
                return "Tag validation error";
            }
            if (inputTeam.Pokemons == null || inputTeam.Pokemons.Count == 0)
            {
                return "No pokemons loaded";
            }
            if (inputTeam.Pokemons != null && inputTeam.Pokemons.Any(p => p != null
                && ((p.DexNumber != null && p.DexNumber < 1)
                || (p.Nickname != null && p.Nickname.Length > 16)
                || (p.Notes != null && p.Notes.Length > 2048)
                || (p.Level != null && (p.Level < 1 || p.Level > 100)))))
            {
                return "Pokemon validation error";
            }
            return null;
        }

        public string? ValidateTeamSearchQueryDTO(TeamSearchQueryDTO? searchQuery)
        {
            if (searchQuery == null)
            {
                return "Query not found";
            }
            if (searchQuery.TeamsPerPage == null || searchQuery.TeamsPerPage < 0 || searchQuery.TeamsPerPage > 100)
            {
                return "Wrong teams per page";
            }
            if (searchQuery.Queries != null && searchQuery.Queries.Any(q => q.Type == "user" && q.Name != null && q.Name.Length > 32))
            {
                return "Player name must be shorter than 32 characters";
            }
            if (searchQuery.Queries != null && searchQuery.Queries.Any(q => q.Type == "tournament" && q.Name != null && q.Name.Length > 256))
            {
                return "Tournament name must be shorter than 32 characters";
            }
            return null;
        }
    }
}
