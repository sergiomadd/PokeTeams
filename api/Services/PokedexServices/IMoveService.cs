using api.DTOs;
using api.DTOs.PokemonDTOs;

namespace api.Services.PokedexServices
{
    public interface IMoveService
    {
        public Task<MoveDTO?> GetMoveByIdentifier(string identifier, int langId);
        public Task<Dictionary<string, MoveDTO>> GetMovesByIdentifiers(List<string> identifiers, int langId);
        public Task<MoveDTO?> GetMoveByName(string name, int langId);
        public Task<MovePreviewDTO?> GetMovePreviewByIdentifier(string identifier, int langId);
        public Task<Dictionary<string, MovePreviewDTO>> GetMovePreviewsByIdentifiers(List<string> identifiers, int langId);
        public Task<List<QueryResultDTO>> QueryMovesByName(string key, int langId);
    }
}
