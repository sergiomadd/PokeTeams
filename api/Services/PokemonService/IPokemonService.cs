using api.Models.DBModels;

namespace api.Services.PokemonService
{
    public interface IPokemonService
    {
        Task<PokemonData?> GetPokemonByName(string name);
        Task<PokemonData?> GetPokemonById(int id);
        Task<Item?> GetItemByName(string name);
        Task<Ability?> GetAbilityByName(string name);
        Task<Nature?> GetNatureByName(string name);
        Task<Move?> GetMoveByName(string name);
        Task<PokeType?> GetTypeByIdentifier(string identifier);
        Task<PokeType?> GetTeraTypeByIdentifier(string identifier);
        Task<string?> GetStatNameByIdentifier(string identifier);

    }
}
