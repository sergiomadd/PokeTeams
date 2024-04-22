using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBModels;
using api.Models.DBPoketeamModels;

namespace api.Services.PokedexService
{
    public interface IPokedexService
    {
        Task<PokemonDTO> BuildPokemonDTO(Pokemon pokemon);
        Task<PokemonPreviewDTO> BuildPokemonPreviewDTO(Pokemon pokemon, EditorOptionsDTO editorOptions);
        Task<PokemonDataDTO?> GetPokemonByName(string name);
        Task<PokemonDataDTO?> GetPokemonById(int id);
        Task<ItemDTO?> GetItemByName(string name);
        Task<ItemDTO?> GetItemByIdentifier(string identifier);
        Task<AbilityDTO?> GetAbilityByName(string name);
        Task<AbilityDTO?> GetAbilityByIdentifier(string identifier);
        Task<NatureDTO?> GetNatureByName(string name);
        Task<NatureDTO?> GetNatureByIdentifier(string identifier);
        Task<MoveDTO?> GetMoveByName(string name);
        Task<PokeTypeWithEffectivenessDTO?> GetTypeWithEffectivenessByIdentifier(string identifier, bool teraType = false);
        Task<string?> GetStatNameByIdentifier(string identifier);

    }
}
