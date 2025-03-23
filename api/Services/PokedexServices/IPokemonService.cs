using api.DTOs.PokemonDTOs;
using api.DTOs;
using api.Models.DBPoketeamModels;

namespace api.Services.PokedexServices
{
    public interface IPokemonService
    {
        public Task<PokemonDTO> BuildPokemonDTO(Pokemon pokemon, int langId, TeamOptionsDTO? options = null);
        public Task<PokemonPreviewDTO> BuildPokemonPreviewDTO(Pokemon pokemon, int langId);
        public Task<PokemonDataDTO?> GetPokemonByName(string name, int langId);
        public Task<PokemonDataDTO?> GetPokemonById(int id, int langId);
        public Task<string?> GetStatNameByIdentifier(string identifier, int langId);
        public Task<List<QueryResultDTO>> QueryPokemonsByName(string key, int langId);
        public Task<List<QueryResultDTO>> QueryAllPokemonMoves(string id, int langId);
    }
}
