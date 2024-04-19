using api.DTOs.PokemonDTOs;
using api.Models.DBModels;

namespace api.Services.PokedexService
{
    public interface IPokedexService
    {
        Task<PokemonDataDTO?> GetPokemonByName(string name);
        Task<PokemonDataDTO?> GetPokemonById(int id);
        Task<ItemDTO?> GetItemByName(string name);
        Task<ItemDTO?> GetItemByIdentifier(string identifier);
        Task<AbilityDTO?> GetAbilityByName(string name);
        Task<AbilityDTO?> GetAbilityByIdentifier(string identifier);
        Task<NatureDTO?> GetNatureByName(string name);
        Task<NatureDTO?> GetNatureByIdentifier(string identifier);
        Task<MoveDTO?> GetMoveByName(string name);
        Task<PokeTypeDTO?> GetTypeByIdentifier(string identifier);
        Task<PokeTypeDTO?> GetTeraTypeByIdentifier(string identifier);
        Task<string?> GetStatNameByIdentifier(string identifier);

    }
}
