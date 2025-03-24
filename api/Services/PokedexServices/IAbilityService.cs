using api.DTOs;
using api.DTOs.PokemonDTOs;

namespace api.Services.PokedexServices
{
    public interface IAbilityService
    {
        public Task<AbilityDTO?> GetAbilityByName(string name, int langId);
        public Task<AbilityDTO?> GetAbilityByIdentifier(string identifier, int langId);
        public Task<bool> IsAbilityPokemonHiddenAbility(string abilityIdentifier, int dexNumber);
        public Task<List<QueryResultDTO>> QueryAbilitiesByName(string key, int langId);
        public Task<List<QueryResultDTO>> QueryAllAbilities(int langId);
        public Task<List<QueryResultDTO>> QueryAllPokemonAbilites(string id, int langId);
    }
}
