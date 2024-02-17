using api.Data;
using api.Models.DBPoketeamModels;
using api.Models.DTOs;
using System.Text.Json;
using api.Services.UserService;
using api.Util;
using System.Data;

namespace api.Services.TeamService
{
    public class TeamService : ITeamService
    {
        private readonly PokeTeamContext _teamContext;
        private readonly LocalContext _localContext;
        private readonly IUserService _userService;

        private static Random random = new Random();

        public TeamService(
            PokeTeamContext dataContext,
            LocalContext localContext,
            IUserService userService)
        {
            _teamContext = dataContext;
            _localContext = localContext;
            _userService = userService;
        }
        
        public async Task<TeamDTO?> GetTeam(string id)
        {
            Printer.Log("Getting team with id: ", id);
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
                    User player = await _userService.GetUserById(team.PlayerId);
                    playerUserName = player.UserName;
                }
                else if (team.AnonPlayer != null)
                {
                    playerUserName = team.AnonPlayer;
                }
                teamDTO = new TeamDTO(
                    id,
                    pokemons, 
                    team.Options,
                    playerUserName,
                    team.Tournament,
                    team.Regulation,
                    team.ViewCount,
                    team.DateAdded,
                    team.Visibility
                    );
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
                    PlayerId = player != null ? player.Id : null,
                    AnonPlayer = player == null ? inputTeam.Player : null,
                    Tournament = inputTeam.Tournament ?? null,
                    Regulation = inputTeam.Regulation ?? null,
                    ViewCount = 0,
                    DateAdded = DateTime.Now.ToString("dd/MM/yyyy"),
                    Visibility = inputTeam.Visibility
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

        public async Task<bool> SaveUserTeam(string userID, string teamID)
        {
            try
            {
                IQueryable<UserTeam> userTeams = _teamContext.UserTeam.Where(ut => ut.UserId == userID);
                if (userTeams != null)
                {
                    if (userTeams.Any(ut => ut.TeamId == teamID))
                    {
                        return false;
                    }
                    UserTeam newUserTeam = new UserTeam
                    {
                        UserId = userID,
                        TeamId = teamID
                    };
                    _teamContext.UserTeam.Add(newUserTeam);
                    await _teamContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Printer.Log("Exception in: SaveUserTeam(string userID, string teamID)");
                Printer.Log(ex);
                return false;
            }
            return true;
        }

        public async Task<bool> DeleteUserTeams(User user)
        {
            Printer.Log("Deleting user teams of: ", user.UserName);
                try
                {
                    
                    List<UserTeam> userTeams = _teamContext.UserTeam.Where(ut => ut.UserId == user.Id).ToList();
                    if (userTeams != null && userTeams.Count() > 0)
                    {
                        foreach (var userTeam in userTeams)
                        {
                            
                            if (userTeam != null && userTeam.TeamId != null && userTeam.TeamId != "")
                            {

                                //DeleteTeam(userTeam.TeamId);
                                Printer.Log("Deleting userteam in method: ", userTeam.TeamId);
                                
                                Team team = await _teamContext.Team.FindAsync(userTeam.TeamId);
                                
                                if (team != null)
                                {
                                    List<TeamPokemon> teamPokemons = _teamContext.TeamPokemon.Where(tp => tp.TeamId == userTeam.TeamId).ToList();
                                    if (teamPokemons.Count > 0)
                                    {
                                        foreach (TeamPokemon teamPokemon in teamPokemons)
                                        {
                                            Printer.Log("Deleting pokemon in method: ", teamPokemon.Pokemon);

                                            _teamContext.TeamPokemon.Remove(teamPokemon);
                                        }
                                    }
                                    Printer.Log("Deleting team in method: ", team.Id);
                                    _teamContext.Team.Remove(team);

                                }
                                _teamContext.UserTeam.Remove(userTeam);

                            }
                        }
                    }
                    await _teamContext.SaveChangesAsync();
                    
                }
                catch (Exception ex)
                {
                    Printer.Log("Exception in: DeleteUserByUserName(string userName)");
                    Printer.Log(ex);
                }
            
            Printer.Log("Deleting user teams of: ", user.UserName);
            using (var tran = _teamContext.Database.BeginTransaction())
            {
                try
                {

                    List<UserTeam> userTeams = _teamContext.UserTeam.Where(ut => ut.UserId == user.Id).ToList();
                    if (userTeams.Count() > 0)
                    {
                        foreach (var userTeam in userTeams)
                        {
                            //DeleteTeam(userTeam.TeamId);
                            Printer.Log("Deleting team in method: ", userTeam.TeamId);

                            Team team = await _teamContext.Team.FindAsync(userTeam.TeamId);

                            if (team != null)
                            {
                                List<TeamPokemon> teamPokemons = _teamContext.TeamPokemon.Where(tp => tp.TeamId == userTeam.TeamId).ToList();
                                if (teamPokemons.Count > 0)
                                {
                                    foreach (TeamPokemon teamPokemon in teamPokemons)
                                    {
                                        _teamContext.TeamPokemon.Remove(teamPokemon);
                                    }
                                }
                                _teamContext.Team.Remove(team);
                            }
                            _teamContext.UserTeam.Remove(userTeam);
                        }
                    }
                    _teamContext.SaveChanges();
                    tran.Commit();
                }
                catch (Exception ex)
                {
                    Printer.Log("Exception in: DeleteUserByUserName(string userName)");
                    Printer.Log(ex);
                    tran.Rollback();
                }
            }
            
            return false;
        }

        public async Task<bool> DeleteTeam(string teamId)
        {
            Printer.Log("Deleting team: ", teamId);

            try
            {
                Team team = await _teamContext.Team.FindAsync(teamId);

                if (team != null)
                {
                    List<TeamPokemon> teamPokemons = _teamContext.TeamPokemon.Where(tp => tp.TeamId == teamId).ToList();
                    if(teamPokemons.Count > 0)
                    {
                        foreach (TeamPokemon teamPokemon in teamPokemons)
                        {
                            _teamContext.TeamPokemon.Remove(teamPokemon);
                        }
                    }
                    _teamContext.Team.Remove(team);
                    _teamContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                Printer.Log("Exception in: DeleteUserByUserName(string userName)");
                Printer.Log(ex);
            }
            return false;
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
