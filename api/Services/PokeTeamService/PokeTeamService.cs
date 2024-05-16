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
using api.Services.PokedexService;
using api.Models.DBPokedexModels;
using Microsoft.Extensions.Options;
using api.Models.DBModels;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace api.Services.TeamService
{
    public class PokeTeamService : IPokeTeamService
    {
        private readonly PokeTeamContext _pokeTeamContext;
        private readonly LocalContext _localContext;
        private readonly IPokedexService _pokedexService;


        private static Random random = new Random();

        public PokeTeamService(PokeTeamContext dataContext, LocalContext localContext, IPokedexService pokedexService)
        {
            _pokeTeamContext = dataContext;
            _localContext = localContext;
            _pokedexService = pokedexService;
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
                    Username = user.UserName,
                    Picture = $"https://localhost:7134/images/sprites/profile-pics/{user.Picture}.png" ?? null,
                    Country = user.Country == null ? GetCountry(user.Country) : null,
                });
            });
            return queriedUsers;
        }

        public async Task<List<UserQueryDTO>> ChunkQueryUsers(string key, int startIndex, int pageSize)
        {
            List<UserQueryDTO> queriedUsers = new List<UserQueryDTO>();
            List<User> users = _pokeTeamContext.Users
                .Where(u => u.UserName.Contains(key))
                .Skip(startIndex).Take(pageSize).ToList();
            users.ForEach(user =>
            {
                queriedUsers.Add(new UserQueryDTO
                {
                    Username = user.UserName,
                    Picture = user.Picture ?? null,
                    Country = user.Country == null ? GetCountry(user.Country) : null,
                });
            });
            return queriedUsers;
        }

        public async Task<TeamPreviewDTO?> BuildTeamPreviewDTO(Team team)
        {
            TeamPreviewDTO teamPreviewDTO = null;
            List<Pokemon> pokemons = _pokeTeamContext.Pokemon.Where(p => p.TeamId.Equals(team.Id)).ToList();
            List<PokemonPreviewDTO> pokemonPreviewDTOs = new List<PokemonPreviewDTO>();

            EditorOptionsDTO editorOptions = JsonSerializer.Deserialize<EditorOptionsDTO?>(team.Options, new JsonSerializerOptions { IncludeFields = false });

            foreach (Pokemon pokemon in pokemons)
            {
                pokemonPreviewDTOs.Add(await _pokedexService.BuildPokemonPreviewDTO(pokemon, editorOptions));
            }

            teamPreviewDTO = new TeamPreviewDTO
            {
                ID = team.Id,
                Pokemons = pokemonPreviewDTOs,
                Options = JsonSerializer.Deserialize<EditorOptionsDTO>(team.Options, new JsonSerializerOptions { IncludeFields = false }),
                Player = await GetTeamPlayer(team),
                //Tournament = GetTournamentByName(team.TournamentName),
                Tournament = BuildTournamentDTO(team.Tournament),
                Regulation = team.Regulation,
                ViewCount = team.ViewCount,
                Date = team.DateCreated.ToShortDateString(),
                Visibility = team.Visibility,
                Tags = await GetTeamTags(team)
            };
            return teamPreviewDTO;
        }

        private async Task<string> GetTeamPlayer(Team team)
        {
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
            return tags;
        }

        public async Task<TeamDTO?> BuildTeamDTO(Team team)
        {
            TeamDTO teamDTO = null;
            if (team != null)
            {
                List<Pokemon> pokemons = _pokeTeamContext.Pokemon.Where(p => p.TeamId.Equals(team.Id)).ToList();
                List<PokemonDTO> pokemonDTOs = new List<PokemonDTO>();

                foreach (Pokemon pokemon in pokemons)
                {
                    pokemonDTOs.Add(await _pokedexService.BuildPokemonDTO(pokemon));
                }

                teamDTO = new TeamDTO(
                    team.Id,
                    pokemonDTOs,
                    team.Options,
                    await GetTeamPlayer(team),
                    //GetTournamentByName(team.TournamentName),
                    BuildTournamentDTO(team.Tournament),
                    team.Regulation,
                    team.ViewCount,
                    team.DateCreated.ToShortDateString(),
                    team.Visibility,
                    await GetTeamTags(team)
                    );
            }
            return teamDTO;
        }

        public async Task<TeamDTO?> GetTeam(string id)
        {
            TeamDTO teamDTO = null;
            try
            {
                Team team = _pokeTeamContext.Team.FirstOrDefault(t => t.Id == id);
                teamDTO = await BuildTeamDTO(team);
                Printer.Log(teamDTO.Player);
                Printer.Log(teamDTO.Pokemons.Count);
            }
            catch (Exception ex)
            {
                Printer.Log(ex.Message);
                return null;
            }
            return teamDTO;
        }

        public async Task<Team?> SaveTeam(TeamUploadDTO inputTeam, string loggedUserName)
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

                User player = null;
                Printer.Log("logged username", loggedUserName);
                if (loggedUserName == inputTeam.Player)
                {
                    Printer.Log("Getting logged user in service");
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
                
                Tournament tournament = await _pokeTeamContext.Tournament.FindAsync(inputTeam.Tournament.ToUpper());
                if(tournament == null)
                {
                    tournament = new Tournament
                    {
                        Name = inputTeam.Tournament,
                        NormalizedName = inputTeam.Tournament.ToUpper(),
                        Official = false
                    };
                }
                
                newTeam = new Team
                {
                    Id = teamId,
                    Pokemons = pokemons,
                    Options = optionsString,
                    PlayerId = player != null ? player.Id : null,
                    AnonPlayer = player == null ? inputTeam.Player : null,
                    Tournament = tournament,
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
                        Country = user.Country != null ? GetCountry(user.Country) : null,
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
                if(country != null)
                {
                    country.Icon = $"https://localhost:7134/images/sprites/flags/{country.code}.svg";
                }
                r.Close();
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

        public async Task<List<TeamPreviewDTO>> QueryTeamsByPokemonName(string key)
        {
            List<TeamPreviewDTO> teamDTOs = new List<TeamPreviewDTO>();
            PokemonDataDTO pokemon = await _pokedexService.GetPokemonByName(key);
            if(pokemon == null)
            {
                return null;
            }
            List<Team> teams = _pokeTeamContext.Team.Where(t => t.Pokemons.Any(p => p.DexNumber == pokemon.DexNumber)).ToList();
            //List<Team> teams = _pokeTeamContext.Team.Where(t => t.Pokemons.Any(p => p.DexNumber == pokemon.DexNumber)).ForEachAsync().ToList();
            foreach(Team team in teams)
            {
                teamDTOs.Add(await BuildTeamPreviewDTO(team));
            }
            return teamDTOs;
        }

        public async Task<List<TeamPreviewDTO>> QueryTeamsByMoveIdentifier(string key)
        {
            List<TeamPreviewDTO> teamDTOs = new List<TeamPreviewDTO>();
            List<Team> teams = _pokeTeamContext.Team.Where(t => t.Pokemons
            .Any(p => p.Move1Identifier == key
            || p.Move2Identifier == key
            || p.Move3Identifier == key
            || p.Move4Identifier == key)).ToList();
            //List<Team> teams = _pokeTeamContext.Team.Where(t => t.Pokemons.Any(p => p.DexNumber == pokemon.DexNumber)).ForEachAsync().ToList();
            foreach (Team team in teams)
            {
                teamDTOs.Add(await BuildTeamPreviewDTO(team));
            }
            return teamDTOs;
        }

        public TournamentDTO BuildTournamentDTO(Tournament tournament)
        {
            TournamentDTO tournamentDTO = null;
            if (tournament != null)
            {
                tournamentDTO = new TournamentDTO
                {
                    Name = tournament.Name,
                    City = tournament.City,
                    CountryCode = tournament.CountryCode,
                    Official = tournament.Official,
                    Regulation = BuildRegulationDTO(tournament.Regulation),
                    Date = tournament.Date
                };
            }
            return tournamentDTO;
        }

        public Tournament BreakTournamentDTO(TournamentDTO tournamentDTO)
        {
            Tournament tournament = null;
            if (tournamentDTO != null)
            {
                tournament = new Tournament
                {
                    Name = tournamentDTO.Name,
                    NormalizedName = tournamentDTO.Name.ToLower(),
                    City = tournamentDTO.City,
                    CountryCode = tournamentDTO.CountryCode,
                    Official = tournamentDTO.Official,
                    Regulation = BreakRegulationDTO(tournamentDTO.Regulation),
                    Date = tournamentDTO.Date
                };
            }
            return tournament;
        }

        public List<TournamentDTO> GetAllTournaments()
        {
            List<TournamentDTO> tournamentDTOs = new List<TournamentDTO>();
            List<Tournament> tournaments = _pokeTeamContext.Tournament.ToList();
            foreach (Tournament tournament in tournaments)
            {
                tournamentDTOs.Add(BuildTournamentDTO(tournament));
            }
            return tournamentDTOs;
        }

        public async Task<TournamentDTO> GetTournamentByName(string name)
        {
            TournamentDTO tournamentDTO = null;
            Tournament tournament = await _pokeTeamContext.Tournament.FindAsync(name.ToLower());
            if (tournament != null)
            {
                tournamentDTO = BuildTournamentDTO(tournament);
            }
            return tournamentDTO;
        }

        public async Task<Tournament> SaveTournament(TournamentDTO tournamentDTO)
        {
            try
            {
                if (tournamentDTO != null)
                {
                    Tournament tournament = BreakTournamentDTO(tournamentDTO);
                    await _pokeTeamContext.Tournament.AddAsync(tournament);
                    await _pokeTeamContext.SaveChangesAsync();
                    return tournament;
                }
            }
            catch (Exception ex)
            {
                Printer.Log("Error adding tournament");
                Printer.Log(ex.Message);
            }
            return null;
        }

        public RegulationDTO BuildRegulationDTO(Regulation regulation)
        {
            RegulationDTO regulationDTO = null;
            if (regulation != null)
            {
                regulationDTO = new RegulationDTO
                {
                    Identifier = regulation.Identifier,
                    Name = regulation.Name,
                    StartDate = regulation.StartDate,
                    EndDate = regulation.EndDate
                };
            }
            return regulationDTO;
        }

        public Regulation BreakRegulationDTO(RegulationDTO regulationDTO)
        {
            Regulation regulation = null;
            if (regulationDTO != null)
            {
                regulation = new Regulation
                {
                    Identifier = regulationDTO.Identifier,
                    Name = regulationDTO.Name,
                    StartDate = regulationDTO.StartDate,
                    EndDate = regulationDTO.EndDate
                };
            }
            return regulation;
        }
    }
}
