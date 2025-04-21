using api.DTOs.PokemonDTOs;
using api.DTOs;

namespace api.Services.PokedexServices
{
    public interface ITypeService
    {
        public Task<PokeTypeDTO?> GetTypeById(int id, int langId, bool teraType = false);
        public Task<PokeTypeDTO?> GetTypeByIdentifier(string identifier, bool teraType, int langId);
        public Task<PokeTypeWithEffectivenessDTO?> GetTypeWithEffectivenessById(int id, int langId);
        public Task<PokeTypeWithEffectivenessDTO?> GetTypeWithEffectivenessByIdentifier(string identifier, int langId, bool teraType = false);
        public Task<EffectivenessDTO?> GetTypeEffectivenessAttack(int id, int langId);
        public Task<EffectivenessDTO?> GetTypeEffectivenessDefense(int id, int langId);
        public Task<PokeTypesDTO?> GetPokemonTypes(int id, int langId);
        public Task<PokeTypesWithEffectivenessDTO?> GetPokemonTypesWithEffectiveness(int id, int langId);
        public Task<List<PokeTypeDTO>> GetAllTypes(int langId);
        public Task<List<PokeTypeDTO>> GetAllTeraTypes(int langId);
        public Task<List<QueryResultDTO>> QueryTypesByName(string key, int langId, bool teraType = false);
        public Task<List<QueryResultDTO>> QueryAllTeraTypes(int langId);
    }
}
