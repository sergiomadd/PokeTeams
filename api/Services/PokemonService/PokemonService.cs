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

        public async Task<Pokemon?> GetPokemonByName(string name)
        {
            /*
             * Problem: multiple pokemons with same name but different local_language_id
             * Change local_language_id to received parameter, as in used selected lang option
            */
            Pokemon pokemonData = null;
            Pokemon_species_names pokemonName = await _context.Pokemon_species_names.FindAsync(name);
            if (pokemonName != null)
            {
                List<string> stats = new List<string>();
                for(int i=1; i<7;i++)
                {
                    Pokemon_stats pokemonStat = await _context.Pokemon_stats.FindAsync(pokemonName.pokemon_species_id, i);
                    Stat_names statNames = await _context.Stat_names.FindAsync(i, 9); //change 9 to local_language_id
                    if (pokemonStat != null && statNames != null) 
                    {
                        stats.Add(statNames.name + ' ' + pokemonStat.base_stat.ToString());
                    }
                }
                pokemonData = new Pokemon(name, pokemonName.pokemon_species_id, stats);
            }
            return pokemonData;
        }


        public async Task<Item?> GetItemByName(string name)
        {
            //Problem: only works with exact match (case sensitive name)

            Item item = null;
            Item_names itemNames = await _context.Item_names.FindAsync(name);
            if(itemNames != null)
            {
                Item_prose itemProse = await _context.Item_prose.FindAsync(itemNames.item_id);
                if (itemProse != null)
                {
                    item = new Item(name, itemProse.effect);
                }

            }
            return item;
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
