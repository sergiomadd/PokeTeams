using api.DTOs.PokemonDTOs;
using api.DTOs;
using api.Models.DBPoketeamModels;

namespace api.Services
{
    public interface IPokemonService
    {
        public Task<PokemonDTO> BuildPokemonDTO(Pokemon pokemon, int langId, TeamOptionsDTO? options = null);
        public Task<PokemonPreviewDTO> BuildPokemonPreviewDTO(Pokemon pokemon, int langId);
        public Pokemon BreakPokemonDTO(PokemonDTO pokemonDTO, string teamId);
        public Task<PokemonDTO?> GetPokemonById(int id, int langId);
        public Task<PokemonDataDTO> GetPokemonDataById(int id, int langId);
        public Task<PokemonPreviewDTO?> GetPokemonPreviewById(int id, int langId);
        public Task<List<PokemonPreviewDTO>> GetTeamPokemonPreviews(string id, int langId);
        public Task<PokemonDataDTO?> GetPokemonDataByName(string name, int langId);
        public Task<List<QueryResultDTO>> QueryPokemonsByName(string key, int langId);
    }
}
