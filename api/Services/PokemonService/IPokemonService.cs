namespace api.Services.PokemonService
{
    public interface IPokemonService
    {
        Task<List<Pokemon>?> GetAllPokemon();
        Task<Pokemon?> GetPokemonById(int id);
        Task<List<Item_names?>> GetItems();
        Task<ItemModel?> GetItemByName(string name);
    }
}
