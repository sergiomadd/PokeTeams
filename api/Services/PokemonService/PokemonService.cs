using api.Data;
using api.Models;
using api.Models.DBModels;
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

        public async Task<Item?> GetItemByName(string name)
        {
            //Problem: only works with exact match (case sensitive name)

            Item itemModel = null;
            Item_names item = await _context.Item_names.FindAsync(name);
            if(item != null)
            {
                Item_prose itemProse = await _context.Item_prose.FindAsync(item.item_id);
                if (itemProse != null)
                {
                    itemModel = new Item(name, itemProse.effect);
                }

            }
            return itemModel;
        }

        public async Task<Ability?> GetAbilityByName(string name)
        {
            Ability ability = null;
            Ability_names abilityNames = await _context.Ability_names.FindAsync(name);
            if (abilityNames != null)
            {
                Ability_prose abilityProse = await _context.Ability_prose.FindAsync(abilityNames.ability_id, abilityNames.local_language_id); ;
                if(abilityProse != null)
                {
                    ability = new Ability(name, abilityProse.effect);
                }
            }
            return ability;
        }

        public async Task<Nature?> GetNatureByName(string name)
        {
            Nature nature = null;
            Nature_names natureNames = await _context.Nature_names.FindAsync(name);
            if (natureNames != null)
            {
                Natures natures = await _context.Natures
                    .FindAsync(natureNames.nature_id);
                if (natures != null)
                {
                    Stat_names increasedStatName = await _context.Stat_names.FindAsync(natures.increased_stat_id, natureNames.local_language_id);
                    Stat_names decreasedStatName = await _context.Stat_names.FindAsync(natures.decreased_stat_id, natureNames.local_language_id);
                    if(increasedStatName != null && decreasedStatName != null)
                    {
                        nature = new Nature(name, increasedStatName.name, decreasedStatName.name);
                    }
                }
            }
            return nature;
        }
    }
}
