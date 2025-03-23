using api.DTOs;
using api.DTOs.PokemonDTOs;

namespace api.Services.PokedexServices
{
    public interface IMoveService
    {
        public Task<MoveDTO?> GetMoveByIdentifier(string identifier, int langId);
        public Task<MoveDTO?> GetMoveByName(string name, int langId);
        public Task<List<QueryResultDTO>> QueryMovesByName(string key, int langId);
    }
}
