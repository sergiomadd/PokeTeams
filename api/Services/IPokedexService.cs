using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBModels;
using api.Models.DBPoketeamModels;

namespace api.Services
{
    public interface IPokedexService
    {
        public Task<PokemonDTO> BuildPokemonDTO(Pokemon pokemon);
        public Task<PokemonPreviewDTO> BuildPokemonPreviewDTO(Pokemon pokemon, EditorOptionsDTO editorOptions);
        public Task<PokemonDataDTO?> GetPokemonByName(string name);
        public Task<PokemonDataDTO?> GetPokemonById(int id);
        public Task<ItemDTO?> GetItemByName(string name);
        public Task<ItemDTO?> GetItemByIdentifier(string identifier);
        public Task<AbilityDTO?> GetAbilityByName(string name);
        public Task<AbilityDTO?> GetAbilityByIdentifier(string identifier);
        public Task<NatureDTO?> GetNatureByName(string name);
        public Task<NatureDTO?> GetNatureByIdentifier(string identifier);
        public Task<MoveDTO?> GetMoveByName(string name);
        public Task<List<PokeTypeDTO>> GetAllTypes();
        public Task<List<PokeTypeDTO>> GetAllTeraTypes();
        public Task<PokeTypeWithEffectivenessDTO?> GetTypeWithEffectivenessByIdentifier(string identifier, bool teraType = false);
        public Task<string?> GetStatNameByIdentifier(string identifier);
        public List<TagDTO> QueryPokemonsByName(string key);
        public List<TagDTO> QueryMovesByName(string key);
        public List<TagDTO> QueryItemsByName(string key);

    }
}
