using api.Models.DBModels;
using api.Models.DTOs.PokemonDTOs;

namespace api.Services.PokedexService
{
    public interface IPokedexService
    {
        Task<PokemonData?> GetPokemonByName(string name);
        Task<PokemonData?> GetPokemonById(int id);
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
