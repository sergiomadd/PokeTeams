using api.DTOs;
using api.DTOs.PokemonDTOs;

namespace api.Services.PokedexServices
{
    public interface INatureService
    {
        public Task<NatureDTO?> GetNatureByIdentifier(string identifier, int langId);
        public Task<NatureDTO?> GetNatureByName(string name, int langId);
        public Task<List<NatureDTO>> GetAllNatures(int langId);
        public Task<List<QueryResultDTO>> QueryNaturesByName(string key, int langId);
        public Task<List<QueryResultDTO>> QueryAllNatures(int langId);
    }
}
