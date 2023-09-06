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
    }
}
