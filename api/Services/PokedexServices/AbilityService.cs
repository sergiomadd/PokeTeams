using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models;
using api.Models.DBModels;
using api.Models.DBPokedexModels;
using api.Util;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace api.Services.PokedexServices
{
    public class AbilityService : IAbilityService
    {
        private readonly IPokedexContext _pokedexContext;

        public AbilityService(IPokedexContext pokedexContext)
        {
            _pokedexContext = pokedexContext;
        }

        public async Task<AbilityDTO?> GetAbilityByIdentifier(string identifier, int langId)
        {
            AbilityDTO? ability = null;

            var query =
                from abilities in _pokedexContext.Abilities.Where(i => i.identifier == identifier)

                join abilityNames in _pokedexContext.Ability_names
                on new { Key1 = abilities.id, Key2 = langId } equals new { Key1 = abilityNames.ability_id, Key2 = abilityNames.local_language_id } into abilityNamesJoin
                from abilityNames in abilityNamesJoin.DefaultIfEmpty()

                join abilityNamesDefault in _pokedexContext.Ability_names
                on new { Key1 = abilities.id, Key2 = (int)Lang.en } equals new { Key1 = abilityNamesDefault.ability_id, Key2 = abilityNamesDefault.local_language_id } into abilityNamesDefaultJoin
                from abilityNamesDefault in abilityNamesDefaultJoin.DefaultIfEmpty()

                join abilityProses in _pokedexContext.Ability_prose
                on new { Key1 = abilities.id, Key2 = langId } equals new { Key1 = abilityProses.ability_id, Key2 = abilityProses.local_language_id } into abilityProsesJoin
                from abilityProses in abilityProsesJoin.DefaultIfEmpty()

                join abilityProsesDefault in _pokedexContext.Ability_prose
                on new { Key1 = abilities.id, Key2 = (int)Lang.en } equals new { Key1 = abilityProsesDefault.ability_id, Key2 = abilityProsesDefault.local_language_id } into abilityProsesDefaultJoin
                from abilityProsesDefault in abilityProsesDefaultJoin.DefaultIfEmpty()

                select new AbilityDTO(
                    abilities.identifier,

                    new LocalizedText(abilityNames != null ? abilityNames.name : abilityNamesDefault.name,
                        abilityNames != null ? abilityNames.local_language_id : abilityNamesDefault.local_language_id),

                    new LocalizedText(Formatter.FormatProse(abilityProses != null ? abilityProses.effect : abilityProsesDefault.effect, null),
                        abilityProses != null ? abilityProses.local_language_id : abilityProsesDefault.local_language_id),

                    false);

            ability = await query.FirstOrDefaultAsync();

            return ability;
        }

        public async Task<AbilityDTO?> GetAbilityByName(string name, int langId)
        {
            AbilityDTO? ability = null;

            var query =
                from abilityNamesInput in _pokedexContext.Ability_names.Where(i => i.name == name)

                join abilities in _pokedexContext.Abilities
                on new { Key1 = abilityNamesInput.ability_id } equals new { Key1 = abilities.id } into abilitiesJoin
                from abilities in abilitiesJoin.DefaultIfEmpty()

                join abilityNames in _pokedexContext.Ability_names
                on new { Key1 = abilities.id, Key2 = langId } equals new { Key1 = abilityNames.ability_id, Key2 = abilityNames.local_language_id } into abilityNamesJoin
                from abilityNames in abilityNamesJoin.DefaultIfEmpty()

                join abilityNamesDefault in _pokedexContext.Ability_names
                on new { Key1 = abilities.id, Key2 = (int)Lang.en } equals new { Key1 = abilityNamesDefault.ability_id, Key2 = abilityNamesDefault.local_language_id } into abilityNamesDefaultJoin
                from abilityNamesDefault in abilityNamesDefaultJoin.DefaultIfEmpty()

                join abilityProses in _pokedexContext.Ability_prose
                on new { Key1 = abilities.id, Key2 = langId } equals new { Key1 = abilityProses.ability_id, Key2 = abilityProses.local_language_id } into abilityProsesJoin
                from abilityProses in abilityProsesJoin.DefaultIfEmpty()

                join abilityProsesDefault in _pokedexContext.Ability_prose
                on new { Key1 = abilities.id, Key2 = (int)Lang.en } equals new { Key1 = abilityProsesDefault.ability_id, Key2 = abilityProsesDefault.local_language_id } into abilityProsesDefaultJoin
                from abilityProsesDefault in abilityProsesDefaultJoin.DefaultIfEmpty()

                select new AbilityDTO(
                    abilities.identifier,

                    abilityNames != null || abilityNamesDefault != null ?
                        new LocalizedText(abilityNames != null && abilityNames.local_language_id == langId ? abilityNames.name : abilityNamesDefault.name,
                        abilityNames != null && abilityNames.local_language_id == langId ? abilityNames.local_language_id : abilityNamesDefault.local_language_id) : null,

                    abilityProses != null || abilityProsesDefault != null ?
                        new LocalizedText(Formatter.FormatProse(abilityProses != null && abilityProses.local_language_id == langId ? abilityProses.effect : abilityProsesDefault.effect, null),
                        abilityProses != null && abilityProses.local_language_id == langId ? abilityProses.local_language_id : abilityProsesDefault.local_language_id) : null,

                    false);

            ability = await query.FirstOrDefaultAsync();

            return ability;
        }

        //Check if the given ability is part of pokemon's hidden ability
        public async Task<bool> IsAbilityPokemonHiddenAbility(string abilityIdentifier, int dexNumber)
        {
            var query =
                from pokemonAbilities in _pokedexContext.Pokemon_abilities.Where(p => p.pokemon_id == dexNumber && p.is_hidden)

                join abilities in _pokedexContext.Abilities
                on new { Key1 = pokemonAbilities.ability_id } equals new { Key1 = abilities.id } into abilitiesJoin
                from abilities in abilitiesJoin.DefaultIfEmpty()

                select abilities.identifier;

            string? hiddenAbility = await query.FirstOrDefaultAsync();
            if(hiddenAbility != null && hiddenAbility == abilityIdentifier)
            {
                return true;
            }
            return false;
        }

        public async Task<List<QueryResultDTO>> QueryAllPokemonAbilites(string id, int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            try
            {
                if (Int32.TryParse(id, out _))
                {
                    var query =
                        from pokemonAbilities in _pokedexContext.Pokemon_abilities.Where(p => p.pokemon_id == Int32.Parse(id))

                        join abilities in _pokedexContext.Abilities
                        on new { Key1 = pokemonAbilities.ability_id } equals new { Key1 = abilities.id } into abilitiesJoin
                        from abilities in abilitiesJoin.DefaultIfEmpty()

                        join abilityNames in _pokedexContext.Ability_names
                        on new { Key1 = pokemonAbilities.ability_id, Key2 = langId } equals new { Key1 = abilityNames.ability_id, Key2 = abilityNames.local_language_id } into abilityNamesJoin
                        from abilityNames in abilityNamesJoin.DefaultIfEmpty()

                        join abilityNamesDefault in _pokedexContext.Ability_names
                        on new { Key1 = pokemonAbilities.ability_id, Key2 = (int)Lang.en } equals new { Key1 = abilityNamesDefault.ability_id, Key2 = abilityNamesDefault.local_language_id } into abilityNamesDefaultJoin
                        from abilityNamesDefault in abilityNamesDefaultJoin.DefaultIfEmpty()

                        select abilityNames != null ? new QueryResultDTO(abilityNames.name, abilities.identifier, pokemonAbilities.is_hidden ? "hidden" : null, "ability") :
                            new QueryResultDTO(abilityNamesDefault.name, abilities.identifier, pokemonAbilities.is_hidden ? "hidden" : null, "ability");

                    queryResults = await query.ToListAsync();
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex);
            }

            return queryResults;
        }

        public async Task<List<QueryResultDTO>> QueryAbilitiesByName(string key, int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            var query =
                from abilityNames in _pokedexContext.Ability_names.Where(i => i.name.StartsWith(key) && i.local_language_id == langId)

                join abilities in _pokedexContext.Abilities
                on new { Key1 = abilityNames.ability_id } equals new { Key1 = abilities.id } into abilitiesJoin
                from abilities in abilitiesJoin.DefaultIfEmpty()

                select new QueryResultDTO(abilityNames.name, abilities.identifier, null, "ability");

            queryResults = await query.ToListAsync();

            return queryResults;
        }

        public async Task<List<QueryResultDTO>> QueryAllAbilities(int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            var query =
                from abilities in _pokedexContext.Abilities

                join abilityNames in _pokedexContext.Ability_names
                on new { Key1 = abilities.id, Key2 = langId } equals new { Key1 = abilityNames.ability_id, Key2 = abilityNames.local_language_id } into abilityNamesJoin
                from abilityNames in abilityNamesJoin.DefaultIfEmpty()

                join abilityNamesDefault in _pokedexContext.Ability_names
                on new { Key1 = abilities.id, Key2 = (int)Lang.en } equals new { Key1 = abilityNamesDefault.ability_id, Key2 = abilityNamesDefault.local_language_id } into abilityNamesDefaultJoin
                from abilityNamesDefault in abilityNamesDefaultJoin.DefaultIfEmpty()

                select abilityNames != null ? new QueryResultDTO(abilityNames.name, abilities.identifier, null, "ability") :
                    new QueryResultDTO(abilityNamesDefault.name, abilities.identifier, null, "ability");

            queryResults = await query.ToListAsync();

            return queryResults;
        }
    }
}
