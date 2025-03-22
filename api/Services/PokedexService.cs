using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Migrations;
using api.Models;
using api.Models.DBModels;
using api.Models.DBPokedexModels;
using api.Models.DBPoketeamModels;
using api.Util;
using MethodTimer;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.RegularExpressions;
using static api.DTOs.PokemonDTOs.MoveDTO;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace api.Services
{
    public class PokedexService : IPokedexService
    {
        private readonly IPokedexContext _pokedexContext;

        public PokedexService(IPokedexContext pokedexContext)
        {
            _pokedexContext = pokedexContext;
        }

        [Time]
        public async Task<PokemonDTO> BuildPokemonDTO(Pokemon pokemon, int langId, TeamOptionsDTO? options = null)
        {
            PokemonDataDTO? pokemonData = await GetPokemonById(pokemon.DexNumber ?? 1, langId);
            
            List<MoveDTO?> moves = new List<MoveDTO?>
            {
                await GetMoveByIdentifier(pokemon.Move1Identifier ?? "", langId),
                await GetMoveByIdentifier(pokemon.Move2Identifier ?? "", langId),
                await GetMoveByIdentifier(pokemon.Move3Identifier ?? "", langId),
                await GetMoveByIdentifier(pokemon.Move4Identifier ?? "", langId)
            };

            PokemonDTO pokemonDTO = new PokemonDTO
            {
                Name = pokemonData.Name,
                Nickname = pokemon.Nickname,
                DexNumber = pokemonData.DexNumber,
                PreEvolution = pokemonData.PreEvolution,
                Evolutions = pokemonData.Evolutions,
                Types = pokemonData.Types,
                TeraType = await GetTypeWithEffectivenessByIdentifier(pokemon.TeraTypeIdentifier ?? "", langId, true),
                Item = await GetItemByIdentifier(pokemon.ItemIdentifier ?? "", langId),
                Ability = await GetAbilityByIdentifier(pokemon.AbilityIdentifier ?? "", langId),
                Nature = options != null && options.NaturesVisibility ? await GetNatureByIdentifier(pokemon.NatureIdentifier ?? "", langId) : null,
                Moves = moves,
                Stats = pokemonData.Stats,
                ivs = BuildPokemonIVs(pokemon, options),
                evs = BuildPokemonEVs(pokemon, options),
                Level = pokemon.Level,
                Shiny = pokemon.Shiny,
                Gender = pokemon.Gender,
                Sprite = pokemonData.Sprite,
                Notes = pokemon.Notes
            };

            if (pokemonDTO.Ability != null && pokemonDTO.DexNumber != null 
                && await IsAbilityHidden(pokemonDTO.Ability.Identifier, pokemon.DexNumber ?? 0))
            {
                pokemonDTO.Ability.Hidden = true;
            }

            return pokemonDTO;
        }

        public List<StatDTO?>? BuildPokemonIVs(Pokemon pokemon, TeamOptionsDTO? options)
        {
            List<StatDTO?> ivs = new List<StatDTO?>();
            if (options == null || !options.IvsVisibility)
            {
                return null;
            }
            ivs.Add(new StatDTO("hp", null, pokemon.IV_hp));
            ivs.Add(new StatDTO("attack", null, pokemon.IV_atk));
            ivs.Add(new StatDTO("defense", null, pokemon.IV_def));
            ivs.Add(new StatDTO("special-attack", null, pokemon.IV_spa));
            ivs.Add(new StatDTO("special-defense", null, pokemon.IV_spd));
            ivs.Add(new StatDTO("speed", null, pokemon.IV_spe));
            return ivs;
        }

        public List<StatDTO?>? BuildPokemonEVs(Pokemon pokemon, TeamOptionsDTO? options)
        {
            List<StatDTO?> evs = new List<StatDTO?>();
            if (options == null || !options.IvsVisibility)
            {
                return null;
            }
            evs.Add(new StatDTO("hp", null, pokemon.EV_hp));
            evs.Add(new StatDTO("attack", null, pokemon.EV_atk));
            evs.Add(new StatDTO("defense", null, pokemon.EV_def));
            evs.Add(new StatDTO("special-attack", null, pokemon.EV_spa));
            evs.Add(new StatDTO("special-defense", null, pokemon.EV_spd));
            evs.Add(new StatDTO("speed", null, pokemon.EV_spe));
            return evs;
        }

        [Time]
        public async Task<PokemonPreviewDTO> BuildPokemonPreviewDTO(Pokemon pokemon, int langId)
        {            
            
            List<MovePreviewDTO?> moves = new List<MovePreviewDTO?>()
            {
                await BuildMovePreview(pokemon.Move1Identifier ?? "", langId),
                await BuildMovePreview(pokemon.Move2Identifier ?? "", langId),
                await BuildMovePreview(pokemon.Move3Identifier ?? "", langId),
                await BuildMovePreview(pokemon.Move4Identifier ?? "", langId)
            };
            
            return new PokemonPreviewDTO
            {
                Name = await GetPokemonName(pokemon.DexNumber ?? 1, langId),
                DexNumber = pokemon.DexNumber,
                TeraType = await GetTypeByIdentifier(pokemon.TeraTypeIdentifier ?? "", true, langId),
                Sprite = new SpriteDTO(pokemon.DexNumber ?? 1),
                Shiny = pokemon.Shiny,
                Gender = pokemon.Gender,
                Moves = moves,
                Item = await GetItemByIdentifier(pokemon.ItemIdentifier ?? "", langId),
                AbilityName = GetAbilityByIdentifier(pokemon.AbilityIdentifier ?? "", langId).Result != null ? GetAbilityByIdentifier(pokemon.AbilityIdentifier ?? "", langId).Result.Name : null
            };
        }

        public async Task<MovePreviewDTO?> BuildMovePreview(string identifier, int langId)
        {
            MovePreviewDTO? movePreview = null;

            var query =
                from moves in _pokedexContext.Moves.Where(m => m.identifier == identifier)

                join moveNames in _pokedexContext.Move_names
                on new { Key1 = moves.id, Key2 = langId } equals new { Key1 = moveNames.move_id, Key2 = moveNames.local_language_id } into moveNamesJoin
                from moveNames in moveNamesJoin.DefaultIfEmpty()

                join moveNamesDefault in _pokedexContext.Move_names
                on new { Key1 = moves.id, Key2 = (int)Lang.en } equals new { Key1 = moveNamesDefault.move_id, Key2 = moveNamesDefault.local_language_id } into moveNamesDefaultJoin
                from moveNamesDefault in moveNamesDefaultJoin.DefaultIfEmpty()

                join types in _pokedexContext.Types
                on new { Key1 = moves.type_id } equals new { Key1 = types.id } into typesJoin
                from types in typesJoin.DefaultIfEmpty()

                join typeNames in _pokedexContext.Type_names
                on new { Key1 = types.id, Key2 = langId } equals new { Key1 = typeNames.type_id, Key2 = typeNames.local_language_id } into typeNamesJoin
                from typeNames in typeNamesJoin.DefaultIfEmpty()

                join typeNamesDefault in _pokedexContext.Type_names
                on new { Key1 = types.id, Key2 = (int)Lang.en } equals new { Key1 = typeNamesDefault.type_id, Key2 = typeNamesDefault.local_language_id } into typeNamesDefaultJoin
                from typeNamesDefault in typeNamesDefaultJoin.DefaultIfEmpty()

                select new MovePreviewDTO(
                    moves.identifier,
                    moveNames != null ? new LocalizedText(moveNames.name, moveNames.local_language_id) : new LocalizedText(moveNamesDefault.name, moveNamesDefault.local_language_id),
                    new PokeTypeDTO(
                        types.identifier,
                        typeNames != null ?
                            new LocalizedText(typeNames.name, typeNames.local_language_id) :
                            new LocalizedText(typeNamesDefault.name, typeNames.local_language_id),
                        false));

            movePreview = await query.FirstOrDefaultAsync();

            return movePreview;
        }

        public async Task<PokemonDataDTO?> GetPokemonById(int id, int langId)
        {
            PokemonDataDTO pokemonData = new PokemonDataDTO(
                await GetPokemonName(id, langId),
                id,
                await GetPokemonTypesWithEffectiveness(id, langId),
                await GetPokemonStats(id, langId),
                new SpriteDTO(id),
                preEvolution: await GetPokemonPreEvolution(id, langId),
                evolutions: await GetPokemonEvolutions(id, langId));
            return pokemonData;
        }

        public async Task<PokemonDataDTO?> GetPokemonByName(string name, int langId)
        {
            Pokemon_species_names? pokemonName = await _pokedexContext.Pokemon_species_names.FirstOrDefaultAsync(p => p.name == name);
            if (pokemonName != null)
            {
                return await GetPokemonById(pokemonName.pokemon_species_id, langId);
            }
            return null;
        }

        private async Task<LocalizedText?> GetPokemonName(int id, int langId)
        {
            var query =
                from pokemonSpecies in _pokedexContext.Pokemon_species.Where(p => p.id == id)

                join pokemonSpeciesNames in _pokedexContext.Pokemon_species_names
                on new { Key1 = pokemonSpecies.id, Key2 = langId } equals new { Key1 = pokemonSpeciesNames.pokemon_species_id, Key2 = pokemonSpeciesNames.local_language_id } into pokemonSpeciesNamesJoin
                from pokemonSpeciesNames in pokemonSpeciesNamesJoin.DefaultIfEmpty()

                join pokemonSpeciesNamesDefault in _pokedexContext.Pokemon_species_names
                on new { Key1 = pokemonSpecies.id, Key2 = (int)Lang.en } equals new { Key1 = pokemonSpeciesNamesDefault.pokemon_species_id, Key2 = pokemonSpeciesNamesDefault.local_language_id } into pokemonSpeciesNamesDefaultJoin
                from pokemonSpeciesNamesDefault in pokemonSpeciesNamesDefaultJoin.DefaultIfEmpty()

                select pokemonSpeciesNames != null ? 
                    new LocalizedText(pokemonSpeciesNames.name, pokemonSpeciesNames.local_language_id) :
                    new LocalizedText(pokemonSpeciesNamesDefault.name, pokemonSpeciesNamesDefault.local_language_id);

           return await query.FirstOrDefaultAsync();
        }

        private async Task<List<StatDTO>> GetPokemonStats(int id, int langId)
        {
            List<StatDTO> pokeStats = new List<StatDTO>();
            for (int i = 1; i < 7; i++)
            {
                var query =
                    from pokemonStats in _pokedexContext.Pokemon_stats.Where(s => s.pokemon_id == id && s.stat_id == i)
                    from stats in _pokedexContext.Stats.Where(s => s.id == i)

                    join statNames in _pokedexContext.Stat_names
                    on new { Key1 = stats.id, Key2 = langId } equals new { Key1 = statNames.stat_id, Key2 = statNames.local_language_id } into statNamesJoin
                    from statNames in statNamesJoin.DefaultIfEmpty()

                    join statNamesDefault in _pokedexContext.Stat_names
                    on new { Key1 = stats.id, Key2 = (int)Lang.en } equals new { Key1 = statNamesDefault.stat_id, Key2 = statNamesDefault.local_language_id } into statNamesDefaultJoin
                    from statNamesDefault in statNamesDefaultJoin.DefaultIfEmpty()

                    select new StatDTO(
                        stats.identifier,
                        new LocalizedText(statNames != null ? statNames.name : statNamesDefault.name,
                        statNames != null ? statNames.local_language_id : statNamesDefault.local_language_id),
                        pokemonStats.base_stat);

                StatDTO? stat = await query.FirstOrDefaultAsync();
                if (stat != null) { pokeStats.Add(stat); }
            }
            return pokeStats;
        }

        private async Task<EvolutionDTO?> GetPokemonPreEvolution(int id, int langId)
        {
            Pokemon_species? pokemonSpeciesPreEvolution = await _pokedexContext.Pokemon_species.FirstOrDefaultAsync(p => p.id == id);
            if (pokemonSpeciesPreEvolution != null && pokemonSpeciesPreEvolution.evolves_from_species_id != null)
            {
                int newID = pokemonSpeciesPreEvolution.evolves_from_species_id ?? 0;
                return new EvolutionDTO(
                    await GetPokemonName(newID, langId),
                    newID,
                    await GetPokemonTypes(newID, langId),
                    await GetPokemonStats(newID, langId), 
                    new SpriteDTO(newID),
                    preEvolution: await GetPokemonPreEvolution(newID, langId));
            }
            return null;
        }

        private async Task<List<EvolutionDTO?>> GetPokemonEvolutions(int id, int langId)
        {
            List<EvolutionDTO?> evolutions = new List<EvolutionDTO?>();
            List<Pokemon_species> pokemonSpeciesEvolutionList = await _pokedexContext.Pokemon_species.Where(p => p.evolves_from_species_id == id).ToListAsync();
            if (pokemonSpeciesEvolutionList.Count() > 0)
            {
                foreach (Pokemon_species pokemonSpeciesEvolution in pokemonSpeciesEvolutionList)
                {
                    if (pokemonSpeciesEvolution != null)
                    {
                        int newID = pokemonSpeciesEvolution.id;
                        evolutions.Add(new EvolutionDTO(
                            await GetPokemonName(newID, langId), newID,
                            await GetPokemonTypes(newID, langId),
                            await GetPokemonStats(newID, langId),
                            new SpriteDTO(newID),
                            evolutions: await GetPokemonEvolutions(newID, langId)));
                    }
                }
            }
            return evolutions;
        }

        public async Task<ItemDTO?> GetItemByName(string name, int langId)
        {
            ItemDTO? item = null;

            var query =

                from itemNamesInput in _pokedexContext.Item_names.Where(i => i.name == name)

                join items in _pokedexContext.Items
                on new { Key1 = itemNamesInput.item_id } equals new { Key1 = items.id } into itemsJoin
                from items in itemsJoin.DefaultIfEmpty()

                join itemNames in _pokedexContext.Item_names
                on new { Key1 = items.id, Key2 = langId } equals new { Key1 = itemNames.item_id, Key2 = itemNames.local_language_id } into itemNamesJoin
                from itemNames in itemNamesJoin.DefaultIfEmpty()

                join itemNamesDefault in _pokedexContext.Item_names
                on new { Key1 = items.id, Key2 = (int)Lang.en } equals new { Key1 = itemNamesDefault.item_id, Key2 = itemNamesDefault.local_language_id } into itemNamesDefaultJoin
                from itemNamesDefault in itemNamesDefaultJoin.DefaultIfEmpty()

                join itemProses in _pokedexContext.Item_prose
                on new { Key1 = items.id, Key2 = langId } equals new { Key1 = itemProses.item_id, Key2 = itemProses.local_language_id } into itemProsesJoin
                from itemProses in itemProsesJoin.DefaultIfEmpty()

                join itemProsesDefault in _pokedexContext.Item_prose
                on new { Key1 = items.id, Key2 = (int)Lang.en } equals new { Key1 = itemProsesDefault.item_id, Key2 = itemProsesDefault.local_language_id } into itemProsesDefaultJoin
                from itemProsesDefault in itemProsesDefaultJoin.DefaultIfEmpty()

                select new ItemDTO(
                    items.identifier,

                    itemNames != null || itemProsesDefault != null ? 
                        new LocalizedText(itemNames != null && itemNames.local_language_id == langId ? itemNames.name : itemNamesDefault.name,
                        itemNames != null && itemNames.local_language_id == langId ? itemNames.local_language_id : itemNamesDefault.local_language_id) : null,

                    itemProses != null || itemProsesDefault != null ?
                        new LocalizedText(Formatter.FormatProse(itemProses != null && itemProses.local_language_id == langId ? itemProses.effect : itemProsesDefault.effect, null),
                        itemProses != null && itemProses.local_language_id == langId ? itemProses.local_language_id : itemProsesDefault.local_language_id) : null);

            item = query != null ? await query.FirstOrDefaultAsync() : null;

            return item;
        }

        public async Task<ItemDTO?> GetItemByIdentifier(string identifier, int langId)
        {
            ItemDTO? item = null;

            var query =
                from items in _pokedexContext.Items.Where(i => i.identifier == identifier)

                join itemNames in _pokedexContext.Item_names
                on new { Key1 = items.id, Key2 = langId } equals new { Key1 = itemNames.item_id, Key2 = itemNames.local_language_id } into itemNamesJoin
                from itemNames in itemNamesJoin.DefaultIfEmpty()

                join itemNamesDefault in _pokedexContext.Item_names
                on new { Key1 = items.id, Key2 = (int)Lang.en } equals new { Key1 = itemNamesDefault.item_id, Key2 = itemNamesDefault.local_language_id } into itemNamesDefaultJoin
                from itemNamesDefault in itemNamesDefaultJoin.DefaultIfEmpty()

                join itemProses in _pokedexContext.Item_prose
                on new { Key1 = items.id, Key2 = langId } equals new { Key1 = itemProses.item_id, Key2 = itemProses.local_language_id } into itemProsesJoin
                from itemProses in itemProsesJoin.DefaultIfEmpty()

                join itemProsesDefault in _pokedexContext.Item_prose
                on new { Key1 = items.id, Key2 = (int)Lang.en } equals new { Key1 = itemProsesDefault.item_id, Key2 = itemProsesDefault.local_language_id } into itemProsesDefaultJoin 
                from itemProsesDefault in itemProsesDefaultJoin.DefaultIfEmpty()

                select new ItemDTO(
                    items.identifier,

                    new LocalizedText(itemNames != null ? itemNames.name : itemNamesDefault.name,
                        itemNames != null ? itemNames.local_language_id : itemNamesDefault.local_language_id),

                    new LocalizedText(Formatter.FormatProse(itemProses != null ? itemProses.effect : itemProsesDefault.effect, null),
                        itemProses != null ? itemProses.local_language_id : itemProsesDefault.local_language_id));
            
            item = await query.FirstOrDefaultAsync();

            return item;
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

        public async Task<bool> IsAbilityHidden(string abilityIdentifier, int dexNumber)
        {
            Abilities? abilities = await _pokedexContext.Abilities.FirstOrDefaultAsync(a => a.identifier.Equals(abilityIdentifier));
            if(abilities != null)
            {
                try
                {
                    List<Pokemon_abilities> pokemonAbilitiesList = await _pokedexContext.Pokemon_abilities.Where(p => p.pokemon_id == dexNumber).ToListAsync();
                    if (pokemonAbilitiesList != null && pokemonAbilitiesList.Count > 0)
                    {
                        if (pokemonAbilitiesList.Any(a => a.ability_id == abilities.id))
                        {
                            return true;
                        }
                    }
                }
                catch (Exception ex)
                {
                    Printer.Log(ex);
                }
            }

            return false;
        }

        public async Task<List<NatureDTO>> GetAllNatures(int langId)
        {
            List<NatureDTO> natureDTOs = new List<NatureDTO>();
            List<Natures> naturesList = await _pokedexContext.Natures.ToListAsync();
            if (naturesList != null)
            {
                foreach (Natures naturesItem in naturesList)
                {
                    var query =
                        from natures in _pokedexContext.Natures.Where(i => i.id == naturesItem.id)

                        join natureNames in _pokedexContext.Nature_names
                        on new { Key1 = natures.id, Key2 = langId } equals new { Key1 = natureNames.nature_id, Key2 = natureNames.local_language_id } into natureNamesJoin
                        from natureNames in natureNamesJoin.DefaultIfEmpty()

                        join natureNamesDefault in _pokedexContext.Nature_names
                        on new { Key1 = natures.id, Key2 = (int)Lang.en } equals new { Key1 = natureNamesDefault.nature_id, Key2 = natureNamesDefault.local_language_id } into natureNamesDefaultJoin
                        from natureNamesDefault in natureNamesDefaultJoin.DefaultIfEmpty()

                        join increasedStat in _pokedexContext.Stats
                        on new { Key1 = natures.increased_stat_id } equals new { Key1 = increasedStat.id } into increasedStatJoin
                        from increasedStat in increasedStatJoin.DefaultIfEmpty()

                        join decreasedStat in _pokedexContext.Stats
                        on new { Key1 = natures.decreased_stat_id } equals new { Key1 = decreasedStat.id } into decreasedStatJoin
                        from decreasedStat in decreasedStatJoin.DefaultIfEmpty()

                        select new NatureDTO(
                            new LocalizedText(natureNames != null ? natureNames.name : natureNamesDefault.name,
                                natureNames != null ? natureNames.local_language_id : natureNamesDefault.local_language_id),
                            natures.identifier,
                            increasedStat.identifier,
                            decreasedStat.identifier);

                    NatureDTO? natureDTO = await query.FirstOrDefaultAsync();
                    if(natureDTO != null ) { natureDTOs.Add(natureDTO); }
                }
            }
            return natureDTOs;
        }

        public async Task<NatureDTO?> GetNatureByName(string name, int langId)
        {
            NatureDTO? nature = null;

            var query =
                from natureNamesInput in _pokedexContext.Nature_names.Where(n => n.name == name)

                join natures in _pokedexContext.Natures
                on new { Key1 = natureNamesInput.nature_id } equals new { Key1 = natures.id } into naturesJoin
                from natures in naturesJoin.DefaultIfEmpty()

                join natureNames in _pokedexContext.Nature_names
                on new { Key1 = natures.id, Key2 = langId } equals new { Key1 = natureNames.nature_id, Key2 = natureNames.local_language_id } into natureNamesJoin
                from natureNames in natureNamesJoin.DefaultIfEmpty()

                join natureNamesDefault in _pokedexContext.Nature_names
                on new { Key1 = natures.id, Key2 = (int)Lang.en } equals new { Key1 = natureNamesDefault.nature_id, Key2 = natureNamesDefault.local_language_id } into natureNamesDefaultJoin
                from natureNamesDefault in natureNamesDefaultJoin.DefaultIfEmpty()

                join increasedStat in _pokedexContext.Stats
                on new { Key1 = natures.increased_stat_id } equals new { Key1 = increasedStat.id } into increasedStatJoin
                from increasedStat in increasedStatJoin.DefaultIfEmpty()

                join decreasedStat in _pokedexContext.Stats
                on new { Key1 = natures.decreased_stat_id } equals new { Key1 = decreasedStat.id } into decreasedStatJoin
                from decreasedStat in decreasedStatJoin.DefaultIfEmpty()

                select new NatureDTO(
                    new LocalizedText(natureNames != null ? natureNames.name : natureNamesDefault.name,
                        natureNames != null ? natureNames.local_language_id : natureNamesDefault.local_language_id),
                    natures.identifier,
                    increasedStat.identifier,
                    decreasedStat.identifier);

            nature = await query.FirstOrDefaultAsync();

            return nature;
        }

        public async Task<NatureDTO?> GetNatureByIdentifier(string identifier, int langId)
        {
            NatureDTO? nature = null;

            var query =
                from natures in _pokedexContext.Natures.Where(i => i.identifier == identifier)

                join natureNames in _pokedexContext.Nature_names
                on new { Key1 = natures.id, Key2 = langId } equals new { Key1 = natureNames.nature_id, Key2 = natureNames.local_language_id } into natureNamesJoin
                from natureNames in natureNamesJoin.DefaultIfEmpty()

                join natureNamesDefault in _pokedexContext.Nature_names
                on new { Key1 = natures.id, Key2 = (int)Lang.en } equals new { Key1 = natureNamesDefault.nature_id, Key2 = natureNamesDefault.local_language_id } into natureNamesDefaultJoin
                from natureNamesDefault in natureNamesDefaultJoin.DefaultIfEmpty()

                join increasedStat in _pokedexContext.Stats
                on new { Key1 = natures.increased_stat_id } equals new { Key1 = increasedStat.id } into increasedStatJoin
                from increasedStat in increasedStatJoin.DefaultIfEmpty()

                join decreasedStat in _pokedexContext.Stats
                on new { Key1 = natures.decreased_stat_id } equals new { Key1 = decreasedStat.id } into decreasedStatJoin
                from decreasedStat in decreasedStatJoin.DefaultIfEmpty()

                select new NatureDTO(
                    new LocalizedText(natureNames != null ? natureNames.name : natureNamesDefault.name,
                        natureNames != null ? natureNames.local_language_id : natureNamesDefault.local_language_id),
                    natures.identifier,
                    increasedStat.identifier,
                    decreasedStat.identifier);

            nature = await query.FirstOrDefaultAsync();

            return nature;
        }

        public async Task<MoveDTO?> GetMoveByIdentifier(string identifier, int langId)
        {
            MoveDTO? move = null;

            var query =
                from moves in _pokedexContext.Moves.Where(m => m.identifier == identifier)

                join moveNames in _pokedexContext.Move_names
                on new { Key1 = moves.id, Key2 = langId } equals new { Key1 = moveNames.move_id, Key2 = moveNames.local_language_id } into moveNamesJoin
                from moveNames in moveNamesJoin.DefaultIfEmpty()

                join moveNamesDefault in _pokedexContext.Move_names
                on new { Key1 = moves.id, Key2 = (int)Lang.en } equals new { Key1 = moveNamesDefault.move_id, Key2 = moveNamesDefault.local_language_id } into moveNamesDefaultJoin
                from moveNamesDefault in moveNamesDefaultJoin.DefaultIfEmpty()

                select moveNames != null ? moveNames.name : moveNamesDefault.name;

            string? moveName = await query.FirstOrDefaultAsync();

            if(moveName != null)
            {
                move = await GetMoveByName(moveName, langId);
            }

            return move;
        }

        public async Task<MoveDTO?> GetMoveByName(string name, int langId)
        {
            MoveDTO? move = null;

            var query =
                from moveNamesInput in _pokedexContext.Move_names.Where(m => m.name == name)

                join moves in _pokedexContext.Moves
                on new { Key1 = moveNamesInput.move_id } equals new { Key1 = moves.id } into movesJoin
                from moves in movesJoin.DefaultIfEmpty()

                join moveNames in _pokedexContext.Move_names
                on new { Key1 = moves.id, Key2 = langId } equals new { Key1 = moveNames.move_id, Key2 = moveNames.local_language_id } into moveNamesJoin
                from moveNames in moveNamesJoin.DefaultIfEmpty()

                join moveNamesDefault in _pokedexContext.Move_names
                on new { Key1 = moves.id, Key2 = (int)Lang.en } equals new { Key1 = moveNamesDefault.move_id, Key2 = moveNamesDefault.local_language_id } into moveNamesDefaultJoin
                from moveNamesDefault in moveNamesDefaultJoin.DefaultIfEmpty()

                join types in _pokedexContext.Types
                on new { Key1 = moves.type_id } equals new { Key1 = types.id } into typesJoin
                from types in typesJoin.DefaultIfEmpty()

                join typeNames in _pokedexContext.Type_names
                on new { Key1 = moves.type_id, Key2 = langId } equals new { Key1 = typeNames.type_id, Key2 = typeNames.local_language_id } into typeNamesJoin
                from typeNames in typeNamesJoin.DefaultIfEmpty()

                join typeNamesDefault in _pokedexContext.Type_names
                on new { Key1 = moves.type_id, Key2 = (int)Lang.en } equals new { Key1 = typeNamesDefault.type_id, Key2 = typeNamesDefault.local_language_id } into typeNamesDefaultJoin
                from typeNamesDefault in typeNamesDefaultJoin.DefaultIfEmpty()

                join damageClass in _pokedexContext.Move_damage_class_prose
                on new { Key1 = (int)moves.damage_class_id, Key2 = langId } equals new { Key1 = damageClass.move_damage_class_id, Key2 = damageClass.local_language_id } into damageClassJoin
                from damageClass in damageClassJoin.DefaultIfEmpty()

                join damageClassDefault in _pokedexContext.Move_damage_class_prose
                on new { Key1 = (int)moves.damage_class_id, Key2 = (int)Lang.en } equals new { Key1 = damageClassDefault.move_damage_class_id, Key2 = damageClassDefault.local_language_id } into damageClassDefaultJoin
                from damageClassDefault in damageClassDefaultJoin.DefaultIfEmpty()

                join target in _pokedexContext.Move_target_prose
                on new { Key1 = (int)moves.target_id, Key2 = langId } equals new { Key1 = target.move_target_id, Key2 = target.local_language_id } into targetJoin
                from target in targetJoin.DefaultIfEmpty()

                join targetDefault in _pokedexContext.Move_target_prose
                on new { Key1 = (int)moves.target_id, Key2 = (int)Lang.en } equals new { Key1 = targetDefault.move_target_id, Key2 = targetDefault.local_language_id } into targetDefaultJoin
                from targetDefault in targetDefaultJoin.DefaultIfEmpty()

                join effect in _pokedexContext.Move_effect_prose
                on new { Key1 = (int)moves.effect_id, Key2 = langId } equals new { Key1 = effect.move_effect_id, Key2 = effect.local_language_id } into effectJoin
                from effect in effectJoin.DefaultIfEmpty()

                join effectDefault in _pokedexContext.Move_effect_prose
                on new { Key1 = (int)moves.effect_id, Key2 = (int)Lang.en } equals new { Key1 = effectDefault.move_effect_id, Key2 = effectDefault.local_language_id } into effectDefaultJoin
                from effectDefault in effectDefaultJoin.DefaultIfEmpty()

                join meta in _pokedexContext.Move_meta
                on new { Key1 = moves.type_id } equals new { Key1 = meta.move_id } into metaJoin
                from meta in metaJoin.DefaultIfEmpty()

                join statChanges in _pokedexContext.Move_meta_stat_changes
                on new { Key1 = moves.id } equals new { Key1 = statChanges.move_id } into statChangesJoin
                from statChanges in statChangesJoin.DefaultIfEmpty()

                join statNames in _pokedexContext.Stat_names
                on new { Key1 = statChanges.stat_id, Key2 = langId } equals new { Key1 = statNames.stat_id, Key2 = statNames.local_language_id } into statNamesJoin
                from statNames in statNamesJoin.DefaultIfEmpty()

                join statNamesDefault in _pokedexContext.Stat_names
                on new { Key1 = statChanges.stat_id, Key2 = (int)Lang.en } equals new { Key1 = statNamesDefault.stat_id, Key2 = statNamesDefault.local_language_id } into statNamesDefaultJoin
                from statNamesDefault in statNamesDefaultJoin.DefaultIfEmpty()

                join stats in _pokedexContext.Stats
                on new { Key1 = statChanges.stat_id } equals new { Key1 = stats.id } into statsJoin
                from stats in statsJoin.DefaultIfEmpty()

                select new MoveDTO
                {
                    Identifier = moves.identifier,
                    Name = moveNames != null ? new LocalizedText(moveNames.name, moveNames.local_language_id) : new LocalizedText(moveNamesDefault.name, moveNamesDefault.local_language_id),
                    PokeType = new PokeTypeWithEffectivenessDTO(
                        types.identifier,
                        new LocalizedText(typeNames.name, typeNames.local_language_id),
                        null,
                        null,
                        false),
                    DamageClass = new MoveDamageClass
                    {
                        Name = Formatter.CapitalizeFirst(damageClass != null ? damageClass.name : damageClassDefault.name),
                        Description = damageClass != null ? damageClass.description :damageClassDefault.description,
                        IconPath = $"https://localhost:7134/images/sprites/damage-class/{damageClass.move_damage_class_id}.png"
                    },
                    Power = moves.power,
                    Pp = moves.pp,
                    Accuracy = moves.accuracy,
                    Priority = moves.priority,
                    Target = new MoveTarget
                    {
                        Name = target != null ? target.name : targetDefault.name,
                        Description = target != null ? new LocalizedText(Formatter.FormatProse(target.description, null), target.local_language_id) : 
                            new LocalizedText(Formatter.FormatProse(targetDefault.description, null), targetDefault.local_language_id)
                    },
                    Effect = new MoveEffect
                    {
                        Short = effect != null ? new LocalizedText(Formatter.FormatProse(effect.short_effect, new string[] { moves.effect_chance.ToString() }), effect.local_language_id) :
                            new LocalizedText(Formatter.FormatProse(effectDefault.short_effect, new string[] { moves.effect_chance.ToString() }), effectDefault.local_language_id),

                        Long = effect != null ? new LocalizedText(Formatter.FormatProse(effect.effect, new string[] { moves.effect_chance.ToString() }), effect.local_language_id) :
                            new LocalizedText(Formatter.FormatProse(effectDefault.effect, new string[] { moves.effect_chance.ToString() }), effectDefault.local_language_id),

                        Chance = moves.effect_chance
                    },
                    Meta = new Metadata
                    {
                        MinHits = meta.min_hits,
                        MaxHits = meta.max_hits,
                        MinTurns = meta.min_turns,
                        MaxTurns = meta.max_turns,
                        Drain = meta.drain,
                        Healing = meta.healing,
                        CritRate = meta.crit_rate,
                        StatusChance = meta.ailment_chance,
                        FlinchChance = meta.flinch_chance,
                        StatChange = new StatChange
                        {
                            Stat = new StatDTO(
                                stats.identifier, 
                                statNames != null ? new LocalizedText(statNames.name, statNames.local_language_id) : new LocalizedText(statNamesDefault.name, statNamesDefault.local_language_id),
                                null),
                            Change = statChanges.change,
                            ChangeChance = meta.stat_chance
                        }
                    }
                };

            move = await query.FirstOrDefaultAsync();

            if(move != null && move.PokeType != null)
            {
                Types? types = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.identifier == move.PokeType.Identifier);
                if(types != null)
                {
                    move.PokeType.EffectivenessAttack = await GetTypeEffectivenessAttack(types.id, langId);
                    move.PokeType.EffectivenessDefense = await GetTypeEffectivenessDefense(types.id, langId);
                }
            }

            return move;
        }
        public async Task<string?> GetStatNameByIdentifier(string identifier, int langId)
        {
            string? statName = null;

            var query =
                from stats in _pokedexContext.Stats.Where(i => i.identifier == identifier)

                join statNames in _pokedexContext.Stat_names
                on new { Key1 = stats.id, Key2 = langId } equals new { Key1 = statNames.stat_id, Key2 = statNames.local_language_id } into statNamesJoin
                from statNames in statNamesJoin.DefaultIfEmpty()

                select statNames.name;

            statName = await query.FirstOrDefaultAsync();

            return statName;
        }

        private async Task<PokeTypesDTO> GetPokemonTypes(int id, int langId)
        {
            PokeTypeDTO? type1 = null;
            Pokemon_types? pokemonType1 = await _pokedexContext.Pokemon_types.FirstOrDefaultAsync(t => t.pokemon_id == id && t.slot == 1);
            if (pokemonType1 != null)
            {
                type1 = GetTypeById(pokemonType1.type_id, langId).Result;
            }
            PokeTypeDTO? type2 = null;
            Pokemon_types? pokemonType2 = await _pokedexContext.Pokemon_types.FirstOrDefaultAsync(t => t.pokemon_id == id && t.slot == 2);
            if (pokemonType2 != null)
            {
                type2 = GetTypeById(pokemonType2.type_id, langId).Result;
            }
            PokeTypesDTO pokeTypes = new PokeTypesDTO
            {
                Type1 = type1,
                Type2 = type2
            };
            return pokeTypes;
        }

        private async Task<PokeTypeDTO?> GetTypeById(int id, int langId, bool teraType = false)
        {
            PokeTypeDTO? pokeType = null;

            var query =
                from types in _pokedexContext.Types.Where(t => t.id == id)

                join typeNames in _pokedexContext.Type_names
                on new { Key1 = types.id, Key2 = langId } equals new { Key1 = typeNames.type_id, Key2 = typeNames.local_language_id } into typeNamesJoin
                from typeNames in typeNamesJoin.DefaultIfEmpty()

                join typeNamesDefault in _pokedexContext.Type_names
                on new { Key1 = types.id, Key2 = (int)Lang.en } equals new { Key1 = typeNamesDefault.type_id, Key2 = typeNamesDefault.local_language_id } into typeNamesDefaultJoin
                from typeNamesDefault in typeNamesDefaultJoin.DefaultIfEmpty()

                select new PokeTypeDTO(
                    types.identifier,
                    typeNames != null ? 
                        new LocalizedText(typeNames.name, typeNames.local_language_id) :
                        new LocalizedText(typeNamesDefault.name, typeNames.local_language_id),
                    teraType);

            pokeType = await query.FirstOrDefaultAsync();

            return pokeType;
        }

        public async Task<PokeTypeDTO?> GetTypeByIdentifier(string identifier, bool teraType, int langId)
        {
            PokeTypeDTO? pokeType = null;

            var query =
                from types in _pokedexContext.Types.Where(t => t.identifier == identifier)

                join typeNames in _pokedexContext.Type_names
                on new { Key1 = types.id, Key2 = langId } equals new { Key1 = typeNames.type_id, Key2 = typeNames.local_language_id } into typeNamesJoin
                from typeNames in typeNamesJoin.DefaultIfEmpty()

                join typeNamesDefault in _pokedexContext.Type_names
                on new { Key1 = types.id, Key2 = (int)Lang.en } equals new { Key1 = typeNamesDefault.type_id, Key2 = typeNamesDefault.local_language_id } into typeNamesDefaultJoin
                from typeNamesDefault in typeNamesDefaultJoin.DefaultIfEmpty()

                select new PokeTypeDTO(
                    types.identifier,
                    typeNames != null ?
                        new LocalizedText(typeNames.name, typeNames.local_language_id) :
                        new LocalizedText(typeNamesDefault.name, typeNames.local_language_id),
                    teraType);

            pokeType = await query.FirstOrDefaultAsync();

            return pokeType;
        }

        private async Task<PokeTypesWithEffectivenessDTO?> GetPokemonTypesWithEffectiveness(int id, int langId)
        {
            PokeTypesWithEffectivenessDTO? pokeTypes  = null;

            PokeTypeWithEffectivenessDTO? type1 = null;
            Pokemon_types? pokemonType1 = await _pokedexContext.Pokemon_types.FirstOrDefaultAsync(t => t.pokemon_id == id && t.slot == 1);
            if (pokemonType1 != null)
            {
                type1 = await GetTypeWithEffectivenessById(pokemonType1.type_id, langId);
            }
            PokeTypeWithEffectivenessDTO? type2 = null;
            Pokemon_types? pokemonType2 = await _pokedexContext.Pokemon_types.FirstOrDefaultAsync(t => t.pokemon_id == id && t.slot == 2);
            if (pokemonType2 != null)
            {
                type2 = await GetTypeWithEffectivenessById(pokemonType2.type_id, langId);
            }
            pokeTypes = new PokeTypesWithEffectivenessDTO(type1, type2);
            return pokeTypes;
        }

        private async Task<PokeTypeWithEffectivenessDTO?> GetTypeWithEffectivenessById(int id, int langId)
        {
            PokeTypeWithEffectivenessDTO? pokeType = null;

            var query =
                from types in _pokedexContext.Types.Where(t => t.id == id)

                join typeNames in _pokedexContext.Type_names
                on new { Key1 = types.id, Key2 = langId } equals new { Key1 = typeNames.type_id, Key2 = typeNames.local_language_id } into typeNamesJoin
                from typeNames in typeNamesJoin.DefaultIfEmpty()

                join typeNamesDefault in _pokedexContext.Type_names
                on new { Key1 = types.id, Key2 = (int)Lang.en } equals new { Key1 = typeNamesDefault.type_id, Key2 = typeNamesDefault.local_language_id } into typeNamesDefaultJoin
                from typeNamesDefault in typeNamesDefaultJoin.DefaultIfEmpty()

                select new PokeTypeWithEffectivenessDTO(
                    types.identifier,
                    typeNames != null ?
                        new LocalizedText(typeNames.name, typeNames.local_language_id) :
                        new LocalizedText(typeNamesDefault.name, typeNames.local_language_id),
                    null,
                    null,
                    false);

            pokeType = await query.FirstOrDefaultAsync();

            if (pokeType != null)
            {
                pokeType.EffectivenessAttack = await GetTypeEffectivenessAttack(id, langId);
                pokeType.EffectivenessDefense = await GetTypeEffectivenessDefense(id, langId);
            }

            return pokeType;
        }

        public async Task<PokeTypeWithEffectivenessDTO?> GetTypeWithEffectivenessByIdentifier(string identifier, int langId, bool teraType = false)
        {
            PokeTypeWithEffectivenessDTO? pokeType = null;

            var query =
                from types in _pokedexContext.Types.Where(t => t.identifier == identifier)

                join typeNames in _pokedexContext.Type_names
                on new { Key1 = types.id, Key2 = langId } equals new { Key1 = typeNames.type_id, Key2 = typeNames.local_language_id } into typeNamesJoin
                from typeNames in typeNamesJoin.DefaultIfEmpty()

                join typeNamesDefault in _pokedexContext.Type_names
                on new { Key1 = types.id, Key2 = (int)Lang.en } equals new { Key1 = typeNamesDefault.type_id, Key2 = typeNamesDefault.local_language_id } into typeNamesDefaultJoin
                from typeNamesDefault in typeNamesDefaultJoin.DefaultIfEmpty()

                select new PokeTypeWithEffectivenessDTO(
                    types.identifier,
                    typeNames != null ?
                        new LocalizedText(typeNames.name, typeNames.local_language_id) :
                        new LocalizedText(typeNamesDefault.name, typeNames.local_language_id),
                    null,
                    null,
                    false);

            pokeType = await query.FirstOrDefaultAsync();

            int? id = _pokedexContext.Types.Where(t => t.identifier == identifier).FirstOrDefaultAsync().Result?.id;

            if (pokeType != null && id != null)
            {
                pokeType.EffectivenessAttack = await GetTypeEffectivenessAttack((int)id, langId);
                pokeType.EffectivenessAttack = await GetTypeEffectivenessDefense((int)id, langId);
            }

            return pokeType;
        }

        public async Task<EffectivenessDTO?> GetTypeEffectivenessAttack(int id, int langId)
        {
            EffectivenessDTO? effectiveness = null;
            List<Tuple<PokeTypeDTO, double>> allValues = new List<Tuple<PokeTypeDTO, double>>();
            List<Type_efficacy> typeEfficacyList = await _pokedexContext.Type_efficacy.Where(t => t.damage_type_id == id && t.damage_factor != 100).ToListAsync();
            if (typeEfficacyList != null)
            {
                foreach (var typeEfficacy in typeEfficacyList)
                {
                    PokeTypeDTO? type = await GetTypeById(typeEfficacy.damage_type_id, langId);
                    if(type != null)
                    {
                        allValues.Add(new(type, typeEfficacy.damage_factor / (double)100));
                    }
                }
                effectiveness = new EffectivenessDTO(allValues);
            }
            return effectiveness;
        }

        public async Task<EffectivenessDTO?> GetTypeEffectivenessDefense(int id, int langId)
        {
            EffectivenessDTO? effectiveness = null;
            List<Tuple<PokeTypeDTO, double>> allValues = new List<Tuple<PokeTypeDTO, double>>(); ;
            List<Type_efficacy> typeEfficacyList = await _pokedexContext.Type_efficacy.Where(t => t.target_type_id == id && t.damage_factor != 100).ToListAsync();
            if (typeEfficacyList != null)
            {
                foreach (var typeEfficacy in typeEfficacyList)
                {
                    PokeTypeDTO? type = await GetTypeById(typeEfficacy.damage_type_id, langId);
                    if (type != null)
                    {
                        allValues.Add(new(type, typeEfficacy.damage_factor / (double)100));
                    }
                }
                effectiveness = new EffectivenessDTO(allValues);
            }
            return effectiveness;
        }

        public async Task<List<QueryResultDTO>> QueryPokemonsByName(string key, int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<Pokemon_species_names> pokemonNames = await _pokedexContext.Pokemon_species_names.Where(p => p.name.Contains(key) && p.local_language_id == langId).ToListAsync();
            if (pokemonNames != null && pokemonNames.Count > 0)
            {
                foreach (var pokemonName in pokemonNames)
                {
                    queryResults.Add(new QueryResultDTO(pokemonName.name, pokemonName.pokemon_species_id.ToString(), type: "pokemon",
                        icon: $"https://localhost:7134/images/sprites/pokemon/{pokemonName.pokemon_species_id}.png"));      
                }
            }
            return queryResults;
        }

        public async Task<List<QueryResultDTO>> QueryMovesByName(string key, int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<Move_names> moveNames = await _pokedexContext.Move_names.Where(m => m.name.Contains(key) && m.local_language_id == langId).ToListAsync();
            if (moveNames != null && moveNames.Count > 0)
            {
                foreach (var moveName in moveNames)
                {
                    Moves? moves = await _pokedexContext.Moves.FirstOrDefaultAsync(m => m.id == moveName.move_id);
                    if (moves != null)
                    {
                        Types? targetType = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.id == moves.type_id);
                        if (targetType != null)
                        {
                            var pathStart = "https://localhost:7134/images/sprites/types/generation-ix/";
                            queryResults.Add(new QueryResultDTO(moveName.name, moves.identifier, type: "move", icon: $"{pathStart}{targetType.identifier}.png"));
                        }
                        else
                        {
                            queryResults.Add(new QueryResultDTO(moveName.name, moves.identifier, type: "move"));
                        }
                    }
                    else
                    {
                        queryResults.Add(new QueryResultDTO(moveName.name, moves.identifier, type: "move"));
                    }
                }
            }
            return queryResults;
        }

        public async Task<List<QueryResultDTO>> QueryAllPokemonMoves(string id, int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            if (Int32.TryParse(id, out _))
            {
                List<Pokemon_moves> pokemonMovesList = await _pokedexContext.Pokemon_moves.Where(p => p.pokemon_id == Int32.Parse(id) && p.version_group_id == 20).ToListAsync();
                pokemonMovesList = pokemonMovesList.DistinctBy(p => p.move_id).ToList();
                if (pokemonMovesList != null && pokemonMovesList.Count > 0)
                {
                    foreach (Pokemon_moves pokemonMoves in pokemonMovesList)
                    {
                        Moves? moves = await _pokedexContext.Moves.FirstOrDefaultAsync(m => m.id == pokemonMoves.move_id);
                        if (moves != null)
                        {
                            Move_names moveNames = await _pokedexContext.Move_names.FirstOrDefaultAsync(m => m.move_id == moves.id && m.local_language_id == langId);
                            if (moveNames == null)
                            {
                                moveNames = await _pokedexContext.Move_names.FirstOrDefaultAsync(m => m.move_id == moves.id && m.local_language_id == (int)Lang.en);
                            }
                            if (moveNames != null)
                            {
                                Types? targetType = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.id == moves.type_id);
                                if (targetType != null)
                                {
                                    var pathStart = "https://localhost:7134/images/sprites/types/generation-viii/";
                                    queryResults.Add(new QueryResultDTO(moveNames.name, moves.identifier, icon: $"{pathStart}{targetType.identifier}.png"));
                                }
                                else
                                {
                                    queryResults.Add(new QueryResultDTO(moveNames.name, moves.identifier));
                                }
                            }
                        }
                    }
                }
            }
            return queryResults.OrderBy(m => m.Name).ToList();
        }

        public async Task<List<QueryResultDTO>> QueryItemsByName(string key, int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<Item_names> itemNames = await _pokedexContext.Item_names.Where(i => i.name.Contains(key) && i.local_language_id == langId).ToListAsync();
            if (itemNames != null && itemNames.Count > 0)
            {
                foreach (var itemName in itemNames)
                {
                    Items? items = await _pokedexContext.Items.FirstOrDefaultAsync(i => i.id == itemName.item_id);
                    if (items != null)
                    {
                        string pathStart = "https://localhost:7134/images/sprites/items/";
                        queryResults.Add(new QueryResultDTO(itemName.name, items.identifier, type: "item", icon: $"{pathStart}{items.identifier}.png"));
                    }
                    else
                    {
                        queryResults.Add(new QueryResultDTO(itemName.name, items.identifier, type: "item"));
                    }
                }
            }
            return queryResults;
        }

        public async Task<List<QueryResultDTO>> QueryAbilitiesByName(string key, int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<Ability_names> abilityNames = await _pokedexContext.Ability_names.Where(i => i.name.Contains(key) && i.local_language_id == langId).ToListAsync();
            if (abilityNames != null && abilityNames.Count > 0)
            {
                foreach (var abilityName in abilityNames)
                {
                    queryResults.Add(new QueryResultDTO(abilityName.name, abilityName.ability_id.ToString()));
                }
            }
            return queryResults;
        }

        public async Task<List<QueryResultDTO>> QueryAllAbilities(int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<Abilities> abilitiesList = await _pokedexContext.Abilities.ToListAsync();
            if (abilitiesList != null)
            {
                foreach (Abilities abilities in abilitiesList)
                {
                    Ability_names? abilityNames = await _pokedexContext.Ability_names.FirstOrDefaultAsync(a => a.ability_id == abilities.id && a.local_language_id == langId);
                    if (abilityNames == null)
                    {
                        abilityNames = await _pokedexContext.Ability_names.FirstOrDefaultAsync(a => a.ability_id == abilities.id && a.local_language_id == (int)Lang.en);
                    }
                    if (abilityNames != null)
                    {
                        queryResults.Add(new QueryResultDTO(abilityNames.name, abilityNames.ability_id.ToString()));
                    }
                }
            }
            return queryResults;
        }

        public async Task<List<QueryResultDTO>> QueryAllPokemonAbilites(string id, int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            try
            {
                if (Int32.TryParse(id, out _))
                {
                    List<Pokemon_abilities> pokemonAbilitiesList = await _pokedexContext.Pokemon_abilities.Where(p => p.pokemon_id == Int32.Parse(id)).ToListAsync();
                    if (pokemonAbilitiesList != null && pokemonAbilitiesList.Count > 0)
                    {
                        foreach (Pokemon_abilities pokemonAbilities in pokemonAbilitiesList)
                        {
                            Abilities? abilities = await _pokedexContext.Abilities.FirstOrDefaultAsync(a => a.id == pokemonAbilities.ability_id);
                            if (abilities != null)
                            {
                                Ability_names? abilityNames = await _pokedexContext.Ability_names.FirstOrDefaultAsync(a => a.ability_id == abilities.id && a.local_language_id == langId);
                                if (abilityNames == null)
                                {
                                    abilityNames = await _pokedexContext.Ability_names.FirstOrDefaultAsync(a => a.ability_id == abilities.id && a.local_language_id == (int)Lang.en);
                                }
                                if (abilityNames != null)
                                {
                                    queryResults.Add(new QueryResultDTO(abilityNames.name, abilities.identifier, icon: pokemonAbilities.is_hidden ? "hidden" : null));
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Printer.Log(ex);
            }
            return queryResults;
        }

        public async Task<List<QueryResultDTO>> QueryNaturesByName(string key, int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<Nature_names> natureNames = await _pokedexContext.Nature_names.Where(i => i.name.Contains(key) && i.local_language_id == langId).ToListAsync();
            if (natureNames == null)
            {
                natureNames = await _pokedexContext.Nature_names.Where(i => i.name.Contains(key) && i.local_language_id == (int)Lang.en).ToListAsync();
            }
            if (natureNames != null && natureNames.Count > 0)
            {
                foreach (var natureName in natureNames)
                {
                    queryResults.Add(new QueryResultDTO(natureName.name, natureName.nature_id.ToString()));
                }
            }
            return queryResults;
        }

        public async Task<List<QueryResultDTO>> QueryAllNatures(int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<Natures> naturesList = await _pokedexContext.Natures.ToListAsync();
            if (naturesList != null)
            {
                foreach (Natures natures in naturesList)
                {
                    Nature_names? natureNames = await _pokedexContext.Nature_names.FirstOrDefaultAsync(n => n.nature_id == natures.id && n.local_language_id == langId);
                    if (natureNames == null)
                    {
                        natureNames = await _pokedexContext.Nature_names.FirstOrDefaultAsync(n => n.nature_id == natures.id && n.local_language_id == (int)Lang.en);
                    }
                    queryResults.Add(new QueryResultDTO(natureNames.name, natures.identifier));
                }
            }
            return queryResults;
        }

        public async Task<List<QueryResultDTO>> QueryTypesByName(string key, int langId, bool teraType = false)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<Type_names> typeNames = await _pokedexContext.Type_names.Where(i => i.name.Contains(key) && i.local_language_id == langId).ToListAsync();
            if (typeNames != null && typeNames.Count > 0)
            {
                foreach (var typeName in typeNames)
                {
                    Types? types = await _pokedexContext.Types.FirstOrDefaultAsync(i => i.id == typeName.type_id);
                    if (types != null)
                    {
                        string pathStart = teraType ? "https://localhost:7134/images/sprites/teratypes/"
                        : "https://localhost:7134/images/sprites/types/generation-viii/";
                        queryResults.Add(new QueryResultDTO(typeName.name, typeName.type_id.ToString(), icon: $"{pathStart}{types.identifier}.png"));
                    }
                    else
                    {
                        queryResults.Add(new QueryResultDTO(typeName.name, typeName.type_id.ToString()));
                    }
                }
            }
            return queryResults;
        }

        public async Task<List<PokeTypeDTO>> GetAllTypes(int langId)
        {
            List<PokeTypeDTO> pokeTypes = new List<PokeTypeDTO>();
            List<Types> types = await _pokedexContext.Types.ToListAsync();
            foreach (Types type in types)
            {
                PokeTypeDTO? pokeType = await GetTypeById(type.id, langId);
                if (pokeType != null)
                {
                    pokeTypes.Add(pokeType);
                }
            }
            return pokeTypes;
        }

        public async Task<List<PokeTypeDTO>> GetAllTeraTypes(int langId)
        {
            List<PokeTypeDTO> pokeTypes = new List<PokeTypeDTO>();
            List<Types> types = await _pokedexContext.Types.ToListAsync();
            //Avoid adding last 2 types -> (unkown, shadow) UNSUPPORTED
            for(int i=0; i<types.Count-2; i++)
            {
                PokeTypeDTO? pokeType = await GetTypeById(types[i].id, langId, true);
                if (pokeType != null)
                {
                    pokeTypes.Add(pokeType);
                }
            }
            return pokeTypes;
        }

        public async Task<List<QueryResultDTO>> QueryAllTeraTypes(int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<Types> types = await _pokedexContext.Types.ToListAsync();
            //Avoid adding last 2 types -> (unkown, shadow) UNSUPPORTED
            for (int i = 0; i < types.Count - 2; i++)
            {
                PokeTypeDTO? pokeType = await GetTypeById(types[i].id, langId, true);
                if (pokeType != null)
                {
                    queryResults.Add(new QueryResultDTO(pokeType.Name.Content, pokeType.Identifier, icon: pokeType.IconPath));
                }
            }
            return queryResults;
        }
    }
}
