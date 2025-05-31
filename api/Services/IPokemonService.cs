using api.DTOs.PokemonDTOs;
using api.DTOs;
using api.Models.DBPoketeamModels;

namespace api.Services
{
    public interface IPokemonService
    {
        public Task<PokemonDTO> BuildPokemonDTO(TeamPokemon pokemon, int langId, TeamOptionsDTO? options = null);
        public Task<PokemonPreviewDTO> BuildPokemonPreviewDTO(TeamPokemon pokemon, int langId);
        public TeamPokemon BreakPokemonDTO(PokemonDTO pokemonDTO, string teamId);
        public Task<PokemonDTO?> GetPokemonByTeamPokemonId(int id, int langId);
        public Task<PokemonDataDTO?> GetPokemonDataByPokemonId(int dexNumber, int langId);
        public Task<PokemonDataDTO?> GetPokemonDataByName(string name, int langId);
        public Task<PokemonPreviewDTO?> GetPokemonPreviewByTeamPokemonId(int id, int langId);
        public Task<List<PokemonPreviewDTO>> GetTeamPokemonPreviews(string id, int langId);
        public Task<List<QueryResultDTO>> QueryPokemonsByName(string key, int langId);
    }
}
