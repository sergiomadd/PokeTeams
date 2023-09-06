namespace api.Services.PokemonService
{
    public interface IPokemonService
    {
        Task<List<Pokemon>?> GetAllPokemon();
        Task<Pokemon?> GetPokemonById(int id);
    }
}
