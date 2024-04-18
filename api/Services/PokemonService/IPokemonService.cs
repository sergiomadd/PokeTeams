using api.Models.DBModels;
using api.Models.DBPoketeamModels.Pokemon;

namespace api.Services.PokemonService
{
    public interface IPokemonService
    {
        Task<PokemonData?> GetPokemonByName(string name);
        Task<PokemonData?> GetPokemonById(int id);
        Task<Item?> GetItemByName(string name);
        Task<Item?> GetItemByIdentifier(string identifier);
        Task<Ability?> GetAbilityByName(string name);
        Task<Ability?> GetAbilityByIdentifier(string identifier);
        Task<Nature?> GetNatureByName(string name);
        Task<Nature?> GetNatureByIdentifier(string identifier);
        Task<Move?> GetMoveByName(string name);
        Task<PokeType?> GetTypeByIdentifier(string identifier);
        Task<PokeType?> GetTeraTypeByIdentifier(string identifier);
        Task<string?> GetStatNameByIdentifier(string identifier);

    }
}
