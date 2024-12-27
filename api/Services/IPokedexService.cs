using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBModels;
using api.Models.DBPoketeamModels;

namespace api.Services
{
    public interface IPokedexService
    {
        public Task<PokemonDTO> BuildPokemonDTO(Pokemon pokemon, int langId);
        public Task<PokemonPreviewDTO> BuildPokemonPreviewDTO(Pokemon pokemon, int langId);
        public Task<PokemonDataDTO?> GetPokemonByName(string name, int langId);
        public Task<PokemonDataDTO?> GetPokemonById(int id, int langId);
        public Task<ItemDTO?> GetItemByName(string name, int langId);
        public Task<ItemDTO?> GetItemByIdentifier(string identifier, int langId);
        public Task<AbilityDTO?> GetAbilityByName(string name, int langId);
        public Task<AbilityDTO?> GetAbilityByIdentifier(string identifier, int langId);
        public Task<List<TagDTO>> GetAllAbilitiesTags(int langId);
        public Task<List<TagDTO>> GetPokemonAbilites(string id, int langId);
        public Task<NatureDTO?> GetNatureByName(string name, int langId);
        public Task<NatureDTO?> GetNatureByIdentifier(string identifier, int langId);
        public Task<List<NatureDTO>> GetAllNatures(int langId);
        public Task<MoveDTO?> GetMoveByName(string name, int langId);
        public Task<List<TagDTO>> GetPokemonMoves(string id, int langId);
        public Task<List<PokeTypeDTO>> GetAllTypes(int langId);
        public Task<List<PokeTypeDTO>> GetAllTeraTypes(int langId);
        public Task<List<TagDTO>> QueryTypesByName(string key, int langId, bool teraType = false);
        public Task<PokeTypeWithEffectivenessDTO?> GetTypeWithEffectivenessByIdentifier(string identifier, int langId, bool teraType = false);
        public Task<string?> GetStatNameByIdentifier(string identifier, int langId);
        public Task<List<TagDTO>> QueryPokemonsByName(string key, int langId);
        public Task<List<TagDTO>> QueryMovesByName(string key, int langId);
        public Task<List<TagDTO>> QueryItemsByName(string key, int langId);
        public Task<List<TagDTO>> QueryAbilitiesByName(string key, int langId);
        public Task<List<TagDTO>> QueryNaturesByName(string key, int langId);
        public Task<int> GetLangId(string lang);

    }
}
