using api.Data;
using api.Models.DBPoketeamModels;
using System.Text.Json;
using api.Util;
using System.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using Microsoft.AspNetCore.Components.Forms;

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
        
        public async Task<List<UserQueryDTO>> QueryUsers(string key)
        {
            List<UserQueryDTO> queriedUsers = new List<UserQueryDTO>();
            List<User> users = _pokeTeamContext.Users
                .Where(u => u.UserName.Contains(key)).ToList();
            users.ForEach(user =>
            {
                queriedUsers.Add(new UserQueryDTO
                {
                    UserName = user.UserName,
                    Picture = user.Picture ?? null,
                    Country = user.Country == null ? GetCountry(user.Country) : null,
                });
            });
            return queriedUsers;
        }

        public async Task<TeamDTO?> GetTeam(string id)
        {
            Printer.Log("Gettting team: ", id);
            TeamDTO teamDTO = null;
            try
            {
                Team team = _pokeTeamContext.Team.FirstOrDefault(t => t.Id == id);
                if (team != null)
                {
                    //List<Pokemon> pokemons = JsonSerializer.Deserialize<List<Pokemon>>(team.Pokemons, new JsonSerializerOptions { IncludeFields = false });
                    List<Pokemon> pokemons = _pokeTeamContext.Pokemon.Where(p => p.TeamId.Equals(id)).ToList();
                    List<PokemonDTO> pokemonDTOs = new List<PokemonDTO>();

                    foreach (Pokemon pokemon in pokemons)
                    {
                        //pokemonDTOs.Add(BuildPokemonDTO(pokemon));
                    }


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
                    
                    List<TagDTO> tags = new List<TagDTO>();
                    List<TeamTag> teamTags = _pokeTeamContext.TeamTag.Where(t => t.TeamsId == id).ToList();
                    
                    foreach(TeamTag teamTag in teamTags)
                    {                        
                        Tag tag = _pokeTeamContext.Tag.FirstOrDefault(t => t.Identifier == teamTag.TagsIdentifier);
                        if (tag != null)
                        {
                            TagDTO tagDTO = new TagDTO
                            {
                                Identifier = tag.Identifier,
                                Name = tag.Name,
                                Description = tag.Description,
                                Color = tag.Color
                            };
                            tags.Add(tagDTO);
                        }   
                    }
                    teamDTO = new TeamDTO(
                        id,
                        pokemonDTOs,
                        team.Options,
                        playerUserName,
                        team.Tournament,
                        team.Regulation,
                        team.ViewCount,
                        team.DateCreated.ToShortDateString(),
                        team.Visibility,
                        tags
                        );
                }
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
                foreach(PokemonDTO pokemonDTO in inputTeam.Pokemons)
                {
                    pokemons.Add(BreakPokemonDTO(pokemonDTO, teamId));
                }
                
                JsonSerializerOptions options = new JsonSerializerOptions { IncludeFields = false };
                string optionsString = JsonSerializer.Serialize(inputTeam.Options, options);
                //string pokemonsString = JsonSerializer.Serialize(inputTeam.Pokemons, options);

                User player = null;
                Printer.Log("logged username", loggedUserName);
                if (loggedUserName == inputTeam.Player)
                {
                    player = await GetUserByUserName(inputTeam.Player);
                }

                List<Tag> tags = new List<Tag>();
                foreach(TagDTO tagDTO in inputTeam.Tags)
                {
                    Tag tag = new Tag
                    {
                        Identifier = tagDTO.Identifier,
                        Name = tagDTO.Name,
                        Description = tagDTO.Description,
                        Color = tagDTO.Color,
                    };
                    if(_pokeTeamContext.Tag.Contains(tag))
                    {
                        tags.Add(_pokeTeamContext.Tag.Find(tag.Identifier));
                    }
                    else
                    {
                        tags.Add(tag);
                    }
                }
                
                newTeam = new Team
                {
                    Id = teamId,
                    Pokemons = pokemons,
                    Options = optionsString,
                    PlayerId = player != null ? player.Id : null,
                    AnonPlayer = player == null ? inputTeam.Player : null,
                    Tournament = inputTeam.Tournament ?? null,
                    Regulation = inputTeam.Regulation ?? null,
                    ViewCount = 0,
                    Visibility = inputTeam.Visibility,
                    Tags = tags,
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

        public Pokemon BreakPokemonDTO(PokemonDTO pokemonDTO, string teamId)
        {
            JsonSerializerOptions options = new JsonSerializerOptions { IncludeFields = false };
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
                ivs = pokemonDTO.ivs != null ? JsonSerializer.Serialize(pokemonDTO.ivs, options) : null,
                evs = pokemonDTO.evs != null ? JsonSerializer.Serialize(pokemonDTO.evs, options) : null,
                Level = pokemonDTO.Level,
                Shiny = pokemonDTO.Shiny,
                Gender = pokemonDTO.Gender
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

        public async Task<EditorDataDTO?> GetEditorData()
        {
            EditorDataDTO editorData = _localContext.GetEditorData();
            
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

        public async Task<Tag> GetTag(string identifier)
        {
            Tag tag = await _pokeTeamContext.Tag.FindAsync(identifier);
            if(tag == null)
            {
                return tag;
            }
            return null;
        }

        public async Task<bool> SaveTag(Tag tag)
        {
            try
            {
                await _pokeTeamContext.Tag.AddAsync(tag);
                await _pokeTeamContext.SaveChangesAsync();
            }
            catch(Exception e)
            {
                Printer.Log(e);
                return false;
            }
            return true;
        }
    }
}
