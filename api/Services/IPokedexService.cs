using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBModels;
using api.Models.DBPoketeamModels;

namespace api.Services
{
    public interface IPokedexService
    {
        public Task<PokemonDTO> BuildPokemonDTO(Pokemon pokemon, int langId, TeamOptionsDTO? options = null);
        public Task<PokemonPreviewDTO> BuildPokemonPreviewDTO(Pokemon pokemon, int langId);
        public Task<PokemonDataDTO?> GetPokemonByName(string name, int langId);
        public Task<PokemonDataDTO?> GetPokemonById(int id, int langId);
        public Task<ItemDTO?> GetItemByName(string name, int langId);
        public Task<ItemDTO?> GetItemByIdentifier(string identifier, int langId);
        public Task<AbilityDTO?> GetAbilityByName(string name, int langId);
        public Task<AbilityDTO?> GetAbilityByIdentifier(string identifier, int langId);
        public Task<bool> IsAbilityHidden(string abilityIdentifier, int dexNumber);
        public Task<NatureDTO?> GetNatureByName(string name, int langId);
        public Task<NatureDTO?> GetNatureByIdentifier(string identifier, int langId);
        public Task<List<NatureDTO>> GetAllNatures(int langId);
        public Task<MoveDTO?> GetMoveByName(string name, int langId);
        public Task<List<PokeTypeDTO>> GetAllTypes(int langId);
        public Task<List<PokeTypeDTO>> GetAllTeraTypes(int langId);
        public Task<List<QueryResultDTO>> QueryAllTeraTypes(int langId);
        public Task<List<QueryResultDTO>> QueryTypesByName(string key, int langId, bool teraType = false);
        public Task<PokeTypeWithEffectivenessDTO?> GetTypeWithEffectivenessByIdentifier(string identifier, int langId, bool teraType = false);
        public Task<string?> GetStatNameByIdentifier(string identifier, int langId);
        public Task<List<QueryResultDTO>> QueryPokemonsByName(string key, int langId);
        public Task<List<QueryResultDTO>> QueryMovesByName(string key, int langId);
        public Task<List<QueryResultDTO>> QueryAllPokemonMoves(string id, int langId);
        public Task<List<QueryResultDTO>> QueryItemsByName(string key, int langId);
        public Task<List<QueryResultDTO>> QueryAbilitiesByName(string key, int langId);
        public Task<List<QueryResultDTO>> QueryAllAbilities(int langId);
        public Task<List<QueryResultDTO>> QueryAllPokemonAbilites(string id, int langId);
        public Task<List<QueryResultDTO>> QueryNaturesByName(string key, int langId);
        public Task<List<QueryResultDTO>> QueryAllNatures(int langId);
        public Task<int> GetLangId(string lang);

    }
}
