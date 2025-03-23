using api.DTOs;
using api.DTOs.PokemonDTOs;

namespace api.Services.PokedexServices
{
    public interface IItemService
    {
        public Task<ItemDTO?> GetItemByName(string name, int langId);
        public Task<ItemDTO?> GetItemByIdentifier(string identifier, int langId);
        public Task<List<QueryResultDTO>> QueryItemsByName(string key, int langId);
    }
}
