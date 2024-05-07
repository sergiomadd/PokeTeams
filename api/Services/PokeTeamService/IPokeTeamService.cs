using api.DTOs;
using api.Models.DBPoketeamModels;
using Microsoft.AspNetCore.Identity;

namespace api.Services.TeamService
{
    public interface IPokeTeamService
    {
        
        public Task<TeamDTO?> GetTeam(string id);
        public Task<Team?> SaveTeam(TeamDTO team, string loggedUserName);
        public Task<EditorDataDTO?> GetEditorData();
        public Task<bool> DeleteTeam(string teamId);
        public Task<bool> DeleteUserTeams(User user);
        public Task<UserDTO> BuildUserDTO(User user, bool logged);
        public Task<List<UserQueryDTO>> QueryUsers(string key);
        public Task<List<UserQueryDTO>> ChunkQueryUsers(string key, int startIndex, int pageSize);
        public Task<User> GetUserByUserName(string userName);
        public Task<User> GetUserById(string id);
        public Task<bool> UserNameAvailable(string userName);
        public Task<IdentityResponseDTO> ChangeName(User user, string newName);
        public Task<IdentityResponseDTO> UpdatePicture(User user, string newPictureKey);
        public CountryDTO GetCountry(string code);
        public Task<string> IncrementTeamViewCount(string teamKey);
        public Task<Tag> GetTag(string identifier);
        public Task<bool> SaveTag(Tag tag);
        public Task<List<TeamPreviewDTO>> QueryTeamsByPokemonName(string key);
        public Task<List<TeamPreviewDTO>> QueryTeamsByMoveIdentifier(string key);
        public List<TournamentDTO> GetAllTournaments();
        public Task<TournamentDTO> GetTournamentByName(string name);
        public Task<Tournament> SaveTournament(TournamentDTO tournamentDTO);
    }
}
