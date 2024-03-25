using api.Data;
using api.Models.DBPoketeamModels;
using api.Models.DTOs;
using System.Text.Json;
using api.Util;
using System.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Services.TeamService
{
    public class PokeTeamService : IPokeTeamService
    {
        private readonly PokeTeamContext _pokeTeamContext;
        private readonly LocalContext _localContext;
        private readonly UserManager<User> _userManager;

        private static Random random = new Random();

        public PokeTeamService(PokeTeamContext dataContext, LocalContext localContext)
        {
            _pokeTeamContext = dataContext;
            _localContext = localContext;
        }
        
        public async Task<TeamDTO?> GetTeam(string id)
        {
            TeamDTO teamDTO = null;
            Team team = await _pokeTeamContext.Team.FindAsync(id);
            if (team != null)
            {
                List<Pokemon> pokemons = JsonSerializer.Deserialize<List<Pokemon>>(team.Pokemons, new JsonSerializerOptions { IncludeFields = false });
                string playerUserName = "Unkown";
                if (team.PlayerId != null)
                {
                    User player = await GetUserById(team.PlayerId);
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
                    team.DateCreated.ToShortDateString(),
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
                Team team = await _pokeTeamContext.Team.FindAsync(teamId);
                //loop maybe too ineficent? seek another way to get unused ids?
                while (team != null)
                {
                    teamId = GenerateId(10);
                    team = await _pokeTeamContext.Team.FindAsync(teamId);
                }

                JsonSerializerOptions options = new JsonSerializerOptions { IncludeFields = false };
                string optionsString = JsonSerializer.Serialize(inputTeam.Options, options);
                string pokemonsString = JsonSerializer.Serialize(inputTeam.Pokemons, options);

                User player = await GetUserByUserName(inputTeam.Player);

                newTeam = new Team
                {
                    Id = teamId,
                    Pokemons = pokemonsString,
                    Options = optionsString,
                    PlayerId = player != null ? player.Id : null,
                    AnonPlayer = player == null ? inputTeam.Player : null,
                    Tournament = inputTeam.Tournament ?? null,
                    Regulation = inputTeam.Regulation ?? null,
                    ViewCount = 0,
                    Visibility = inputTeam.Visibility
                };
                await _pokeTeamContext.Team.AddAsync(newTeam);
                await _pokeTeamContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return null;
            }
            return newTeam;
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

        public async Task<UserDTO> BuildUserDTO(User user, bool logged)
        {
            if (user != null)
            {
                if (logged)
                {
                    return new UserDTO
                    {
                        Name = user.Name,
                        Username = user.UserName,
                        TeamKeys = await GetUserTeamKeys(user, logged),
                        Picture = $"https://localhost:7134/images/sprites/profile-pics/{user.Picture}.png",
                        Country = GetCountry(user.Country),
                        Visibility = user.Visibility ? true : false,
                        Email = user.Email,
                        EmailConfirmed = user.EmailConfirmed
                    };
                }
                if (!user.Visibility)
                {
                    return new UserDTO
                    {
                        Username = user.UserName,
                        Picture = $"https://localhost:7134/images/sprites/profile-pics/{user.Picture}.png",
                        Visibility = user.Visibility ? true : false
                    };
                }
                return new UserDTO
                {
                    Name = user.Name,
                    Username = user.UserName,
                    TeamKeys = await GetUserTeamKeys(user, logged),
                    Picture = $"https://localhost:7134/images/sprites/profile-pics/{user.Picture}.png",
                    Country = GetCountry(user.Country),
                    Visibility = user.Visibility ? true : false
                };
            }
            return null;
        }

        public async Task<List<string>> GetUserTeamKeys(User user, bool logged)
        {
            List<string> teamKeys = new List<string>();
            List<Team> userTeams = new List<Team>();
            if (user == null) { Printer.Log(user.Name); return teamKeys; }
            try
            {
                //When logged user get all teams
                if (logged)
                {
                    userTeams = _pokeTeamContext.Team.Where(t => t.PlayerId == user.Id).ToList();
                }
                //When not logged get only public teams
                userTeams = _pokeTeamContext.Team.Where(t => t.PlayerId == user.Id && t.Visibility).ToList();
                //var test = _pokeTeamContext.Team.Where(t => t.PlayerId == user.Id && t.Visibility).Select(t => t.Id);

                foreach (Team team in userTeams)
                {
                    teamKeys.Add(team.Id);
                }
            }
            catch (Exception ex)
            {
                Printer.Log("Exception in: GetUserTeamKeys(User user)");
                Printer.Log(ex);
            }
            return teamKeys;
        }

        public CountryDTO GetCountry(string code)
        {
            CountryDTO country = null;
            using (StreamReader r = new StreamReader("wwwroot/data/countries.json"))
            {
                string json = r.ReadToEnd();
                List<CountryDTO> countries = JsonSerializer.Deserialize<List<CountryDTO>>(json);
                country = countries.Find(c => c.code.Equals(code));
                country.Icon = $"https://localhost:7134/images/sprites/flags/{country.code}.svg";
            }
            return country;
        }

        public async Task<User> GetUserByUserName(string userName)
        {
            User user = _pokeTeamContext.Users.FirstOrDefault(u => u.UserName == userName);
            return user;
        }

        public async Task<User> GetUserById(string id)
        {
            User user = await _pokeTeamContext.Users.FindAsync(id);
            return user;
        }

        public async Task<bool> UserNameAvailable(string userName)
        {
            User user = _pokeTeamContext.Users.FirstOrDefault(u => u.UserName == userName);
            if (user != null)
            {
                return false;
            }
            return true;
        }

        public async Task<IdentityResponseDTO> ChangeName(User user, string newName)
        {
            user.Name = newName;
            _pokeTeamContext.User.Update(user);
            _pokeTeamContext.SaveChanges();
            return new IdentityResponseDTO() { Success = true };
        }

        public async Task<IdentityResponseDTO> UpdatePicture(User user, string newPictureKey)
        {
            user.Picture = newPictureKey;
            _pokeTeamContext.User.Update(user);
            _pokeTeamContext.SaveChanges();
            return new IdentityResponseDTO() { Success = true };
        }


        public async Task<bool> DeleteUserTeams(User user)
        {
            Printer.Log("Deleting teams of: ", user.UserName);
            try
            {
                List<Team> userTeams = _pokeTeamContext.Team.Where(t => t.PlayerId == user.Id).ToList();
                if(userTeams.Count > 0)
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
                if(team == null) { return "Team not found"; }
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
    }
}
