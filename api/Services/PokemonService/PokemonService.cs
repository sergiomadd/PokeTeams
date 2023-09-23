using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services.PokemonService
{
    public class PokemonService : IPokemonService
    {
        private readonly DataContext _context;

        public PokemonService(DataContext dataContext)
        {
            _context = dataContext;
        }

        public async Task<Pokemon?> GetPokemonById(int id)
        {
            return await _context.Pokemon.FindAsync(id);
        }

        public async Task<List<Pokemon>?> GetAllPokemon()
        {
            return await _context.Pokemon.ToListAsync();
        }

        public async Task<ItemModel?> GetItemByName(string name)
        {
            //Problem: only works with exact match (case sensitive name)

            ItemModel itemModel = null;
            Item_names item = await _context.Item_names.FindAsync(name);
            if(item != null)
            {
                Item_prose prose = await _context.Item_prose.FindAsync(item.item_id);

                itemModel = new ItemModel(name, prose.effect);
            }

            return itemModel;
        }
    }
}
