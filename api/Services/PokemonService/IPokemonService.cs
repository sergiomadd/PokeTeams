using api.Models.DBModels;

namespace api.Services.PokemonService
{
    public interface IPokemonService
    {
        Task<List<Pokemon>?> GetAllPokemon();
        Task<Pokemon?> GetPokemonById(int id);
        Task<Item?> GetItemByName(string name);
        Task<Ability?> GetAbilityByName(string name);
    }
}
