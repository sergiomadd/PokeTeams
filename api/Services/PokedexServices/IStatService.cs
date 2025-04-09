using api.DTOs.PokemonDTOs;

namespace api.Services.PokedexServices
{
    public interface IStatService
    {
        public Task<string?> GetStatNameByIdentifier(string identifier, int langId);
        public Task<List<StatDTO>> GetDefaultStatList(int langId);
        public Task<List<StatDTO>> GetPokemonStats(int id, int langId);
    }
}
