using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models;
using api.Models.DBModels;
using api.Models.DBPokedexModels;
using api.Models.DBPoketeamModels;
using api.Util;
using MethodTimer;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Generic;
using System.Text.Json;
using static api.DTOs.PokemonDTOs.MoveDTO;

namespace api.Services
{
    public class PokedexService : IPokedexService
    {
        private readonly IPokedexContext _pokedexContext;

        public PokedexService(IPokedexContext pokedexContext)
        {
            _pokedexContext = pokedexContext;
        }
        public async Task<PokemonDTO> BuildPokemonDTO(Pokemon pokemon, int langId)
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
                Nature = await GetNatureByIdentifier(pokemon.NatureIdentifier ?? "", langId),
                Moves = moves,
                Stats = pokemonData.Stats,
                ivs = pokemon.ivs != null ? JsonSerializer.Deserialize<List<StatDTO?>>(pokemon.ivs, new JsonSerializerOptions { IncludeFields = true }) : null,
                evs = pokemon.evs != null ? JsonSerializer.Deserialize<List<StatDTO?>>(pokemon.evs, new JsonSerializerOptions { IncludeFields = true }) : null,
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
            Moves? moves = await _pokedexContext.Moves.FirstOrDefaultAsync(m => m.identifier == identifier);
            if (moves != null)
            {
                Move_names? moveNames = await _pokedexContext.Move_names.FirstOrDefaultAsync(m => m.move_id == moves.id && m.local_language_id == langId);
                if (moveNames == null)
                {
                    moveNames = await _pokedexContext.Move_names.FirstOrDefaultAsync(m => m.move_id == moves.id && m.local_language_id == (int)Lang.en);
                }
                if (moveNames != null)
                {
                    movePreview = new MovePreviewDTO(
                        moves.identifier,
                        new LocalizedText(moveNames.name, await GetLangIdentifier(moveNames.local_language_id)),
                        await GetTypeById(moves.type_id, langId));
                }
            }
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
            Pokemon_species_names? pokemonSpeciesNames = await _pokedexContext.Pokemon_species_names.FirstOrDefaultAsync(p => p.pokemon_species_id == id && p.local_language_id == langId);
            if (pokemonSpeciesNames == null)
            {
                pokemonSpeciesNames = await _pokedexContext.Pokemon_species_names.FirstOrDefaultAsync(p => p.pokemon_species_id == id && p.local_language_id == (int)Lang.en);
            }
            if (pokemonSpeciesNames != null)
            {
                return new LocalizedText(pokemonSpeciesNames.name, await GetLangIdentifier(pokemonSpeciesNames.local_language_id));
            }
            return null;
        }

        private async Task<List<StatDTO>> GetPokemonStats(int id, int langId)
        {
            List<StatDTO> pokeStats = new List<StatDTO>();
            for (int i = 1; i < 7; i++)
            {
                Pokemon_stats? pokemonStats = await _pokedexContext.Pokemon_stats.FirstOrDefaultAsync(s => s.pokemon_id == id && s.stat_id == i);
                Stat_names? statNames = await _pokedexContext.Stat_names.FirstOrDefaultAsync(s => s.stat_id == i && s.local_language_id == langId);
                if(statNames == null)
                {
                    statNames = await _pokedexContext.Stat_names.FirstOrDefaultAsync(s => s.stat_id == i && s.local_language_id == (int)Lang.en);
                }
                Stats? stats = await _pokedexContext.Stats.FirstOrDefaultAsync(s => s.id == i);
                if (pokemonStats != null && statNames != null && stats != null)
                {
                    pokeStats.Add(new StatDTO(stats.identifier, new LocalizedText(statNames.name, await GetLangIdentifier(statNames.local_language_id)), pokemonStats.base_stat));
                }
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
            Item_names? itemNames = await _pokedexContext.Item_names.FirstOrDefaultAsync(i => i.name == name);
            if (itemNames != null)
            {
                Item_names? localizedItemNames = await _pokedexContext.Item_names.FirstOrDefaultAsync(i => i.item_id == itemNames.item_id && i.local_language_id == langId);
                if(localizedItemNames == null)
                {
                    localizedItemNames = await _pokedexContext.Item_names.FirstOrDefaultAsync(i => i.item_id == itemNames.item_id && i.local_language_id == (int)Lang.en);
                }
                Item_prose? itemProse = await _pokedexContext.Item_prose.FirstOrDefaultAsync(i => i.item_id == itemNames.item_id && i.local_language_id == langId);
                if (itemProse == null)
                {
                    itemProse = await _pokedexContext.Item_prose.FirstOrDefaultAsync(i => i.item_id == itemNames.item_id && i.local_language_id == (int)Lang.en);
                }
                Items? items = await _pokedexContext.Items.FirstOrDefaultAsync(i => i.Id == localizedItemNames.item_id);
                if (itemProse != null && items != null)
                {
                    item = new ItemDTO(items.Identifier,
                        new LocalizedText(localizedItemNames?.name ?? "", await GetLangIdentifier(localizedItemNames.local_language_id)),
                        new LocalizedText(Formatter.FormatProse(itemProse?.effect), await GetLangIdentifier(itemProse.local_language_id)));
                }
            }
            return item;
        }

        public async Task<ItemDTO?> GetItemByIdentifier(string identifier, int langId)
        {
            ItemDTO? item = null;
            Items? items = await _pokedexContext.Items.FirstOrDefaultAsync(i => i.Identifier == identifier);
            if (items != null)
            {
                Item_names? itemNames = await _pokedexContext.Item_names.FirstOrDefaultAsync(i => i.item_id == items.Id && i.local_language_id == langId);
                if (itemNames == null)
                {
                    itemNames = await _pokedexContext.Item_names.FirstOrDefaultAsync(i => i.item_id == items.Id && i.local_language_id == (int)Lang.en);
                }
                Item_prose? itemProse = await _pokedexContext.Item_prose.FirstOrDefaultAsync(i => i.item_id == itemNames.item_id && i.local_language_id == langId);
                if (itemProse == null)
                {
                    itemProse = await _pokedexContext.Item_prose.FirstOrDefaultAsync(i => i.item_id == itemNames.item_id && i.local_language_id == (int)Lang.en);
                }
                if (itemNames != null && itemProse != null)
                {
                    item = new ItemDTO(items.Identifier,
                        new LocalizedText(itemNames.name, await GetLangIdentifier(itemNames.local_language_id)),
                        new LocalizedText(Formatter.FormatProse(itemProse.effect), await GetLangIdentifier(itemProse.local_language_id)));
                }
            }
            return item;
        }

        public async Task<AbilityDTO?> GetAbilityByName(string name, int langId)
        {
            AbilityDTO? ability = null;
            Ability_names? abilityNames = await _pokedexContext.Ability_names.FirstOrDefaultAsync(n => n.name == name);
            if (abilityNames != null)
            {
                Ability_names? localizedAbilityNames = await _pokedexContext.Ability_names.FirstOrDefaultAsync(a => a.ability_id == abilityNames.ability_id && a.local_language_id == langId);
                if (localizedAbilityNames == null)
                {
                    localizedAbilityNames = await _pokedexContext.Ability_names.FirstOrDefaultAsync(a => a.ability_id == abilityNames.ability_id && a.local_language_id == (int)Lang.en);
                }
                Abilities? abilities = await _pokedexContext.Abilities.FirstOrDefaultAsync(a => a.id == abilityNames.ability_id);
                Ability_prose? abilityProse = await _pokedexContext.Ability_prose.FirstOrDefaultAsync(a => a.ability_id == abilityNames.ability_id && a.local_language_id == langId);
                if(abilityProse == null)
                {
                    abilityProse = await _pokedexContext.Ability_prose.FirstOrDefaultAsync(a => a.ability_id == abilityNames.ability_id && a.local_language_id == (int)Lang.en);
                }
                if (abilities != null && abilityProse != null)
                {
                    ability = new AbilityDTO(abilities.identifier, 
                        new LocalizedText(localizedAbilityNames?.name ?? "", await GetLangIdentifier(localizedAbilityNames.local_language_id)),
                        new LocalizedText(Formatter.FormatProse(abilityProse.effect), await GetLangIdentifier(abilityProse.local_language_id)));
                }
            }
            return ability;
        }

        public async Task<AbilityDTO?> GetAbilityByIdentifier(string identifier, int langId)
        {
            AbilityDTO? ability = null;
            Abilities? abilities = await _pokedexContext.Abilities.FirstOrDefaultAsync(a => a.identifier.Equals(identifier));
            if (abilities != null)
            {
                Ability_names? abilityNames = await _pokedexContext.Ability_names.FirstOrDefaultAsync(a => a.ability_id == abilities.id && a.local_language_id == langId);
                if (abilityNames == null)
                {
                    abilityNames = await _pokedexContext.Ability_names.FirstOrDefaultAsync(a => a.ability_id == abilities.id && a.local_language_id == (int)Lang.en);
                }
                Ability_prose? abilityProse = await _pokedexContext.Ability_prose.FirstOrDefaultAsync(a => a.ability_id == abilities.id && a.local_language_id == langId);
                if (abilityProse == null)
                {
                    abilityProse = await _pokedexContext.Ability_prose.FirstOrDefaultAsync(a => a.ability_id == abilities.id && a.local_language_id == (int)Lang.en);
                }
                if (abilityNames != null && abilityProse != null)
                {
                    ability = new AbilityDTO(abilities.identifier,
                        new LocalizedText(abilityNames.name, await GetLangIdentifier(abilityNames.local_language_id)),
                        new LocalizedText(Formatter.FormatProse(abilityProse.effect), await GetLangIdentifier(abilityProse.local_language_id)));
                }
            }
            return ability;
        }

        public async Task<List<TagDTO>> GetAllAbilitiesTags(int langId)
        {
            List<TagDTO> abilityDTOs = new List<TagDTO>();
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
                        abilityDTOs.Add(new TagDTO(abilityNames.name, abilityNames.ability_id.ToString()));
                    }
                }
            }
            return abilityDTOs;
        }

        public async Task<List<TagDTO>> GetPokemonAbilites(string id, int langId)
        {
            List<TagDTO> abilityDTOs = new List<TagDTO>();
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
                                    abilityDTOs.Add(new TagDTO(abilityNames.name, abilities.identifier, icon: pokemonAbilities.is_hidden ? "hidden" : null));
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

            return abilityDTOs;
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
                foreach(Natures natures in naturesList)
                {
                    Nature_names? natureNames = await _pokedexContext.Nature_names.FirstOrDefaultAsync(n => n.nature_id == natures.id && n.local_language_id == langId);
                    if (natureNames == null)
                    {
                        natureNames = await _pokedexContext.Nature_names.FirstOrDefaultAsync(n => n.nature_id == natures.id && n.local_language_id == (int)Lang.en);
                    }
                    Stats? increasedStatIdentifier = await _pokedexContext.Stats.FirstOrDefaultAsync(s => s.id == natures.increased_stat_id);
                    Stats? decreasedStatIdentifier = await _pokedexContext.Stats.FirstOrDefaultAsync(s => s.id == natures.decreased_stat_id);
                    Stat_names? increasedStatName = await _pokedexContext.Stat_names.FirstOrDefaultAsync(s => s.stat_id == natures.increased_stat_id && s.local_language_id == natureNames.local_language_id);
                    Stat_names? decreasedStatName = await _pokedexContext.Stat_names.FirstOrDefaultAsync(s => s.stat_id == natures.decreased_stat_id && s.local_language_id == natureNames.local_language_id);
                    if (increasedStatIdentifier != null && decreasedStatIdentifier != null && decreasedStatName != null && decreasedStatName != null)
                    {
                        natureDTOs.Add(new NatureDTO(
                            new LocalizedText(natureNames?.name ?? "", await GetLangIdentifier(natureNames?.local_language_id ?? 9)),
                            natures.identifier,
                            new StatDTO(increasedStatIdentifier.identifier, new LocalizedText(increasedStatName?.name ?? "", await GetLangIdentifier(increasedStatName?.local_language_id ?? (int)Lang.en)), 0),
                            new StatDTO(decreasedStatIdentifier.identifier, new LocalizedText(decreasedStatName.name, await GetLangIdentifier(decreasedStatName.local_language_id)), 0)));
                    }
                }
            }
            return natureDTOs;
        }

        public async Task<NatureDTO?> GetNatureByName(string name, int langId)
        {
            NatureDTO? nature = null;
            Nature_names? natureNames = await _pokedexContext.Nature_names.FirstOrDefaultAsync(n => n.name == name);
            if (natureNames != null)
            {
                Nature_names? localizedNatureNames = _pokedexContext.Nature_names.FirstOrDefault(n => n.nature_id == natureNames.nature_id && n.local_language_id == langId);
                if(localizedNatureNames == null)
                {
                    localizedNatureNames = await _pokedexContext.Nature_names.FirstOrDefaultAsync(n => n.nature_id == natureNames.nature_id && n.local_language_id == (int)Lang.en);
                }
                if(localizedNatureNames != null)
                {
                    Natures? natures = await _pokedexContext.Natures.FirstOrDefaultAsync(n => n.id == localizedNatureNames.nature_id);
                    if (natures != null)
                    {
                        Stats? increasedStatIdentifier = await _pokedexContext.Stats.FirstOrDefaultAsync(s => s.id == natures.increased_stat_id);
                        Stats? decreasedStatIdentifier = await _pokedexContext.Stats.FirstOrDefaultAsync(s => s.id == natures.decreased_stat_id);
                        Stat_names? increasedStatName = await _pokedexContext.Stat_names.FirstOrDefaultAsync(s => s.stat_id == natures.increased_stat_id && s.local_language_id == natureNames.local_language_id);
                        Stat_names? decreasedStatName = await _pokedexContext.Stat_names.FirstOrDefaultAsync(s => s.stat_id == natures.decreased_stat_id && s.local_language_id == natureNames.local_language_id);
                        if (increasedStatIdentifier != null && decreasedStatIdentifier != null && decreasedStatName != null && decreasedStatName != null)
                        {
                            nature = new NatureDTO(
                                new LocalizedText(localizedNatureNames.name, await GetLangIdentifier(localizedNatureNames.local_language_id)),
                                natures.identifier,
                                new StatDTO(increasedStatIdentifier.identifier, new LocalizedText(increasedStatName.name, await GetLangIdentifier(increasedStatName.local_language_id)), 0),
                                new StatDTO(decreasedStatIdentifier.identifier, new LocalizedText(decreasedStatName.name, await GetLangIdentifier(decreasedStatName.local_language_id)), 0));
                        }
                    }
                }
            }
            return nature;
        }

        public async Task<NatureDTO?> GetNatureByIdentifier(string identifier, int langId)
        {
            NatureDTO? nature = null;
            Natures? natures = await _pokedexContext.Natures.FirstOrDefaultAsync(n => n.identifier.Equals(identifier));
            if (natures != null)
            {
                Nature_names? natureNames = await _pokedexContext.Nature_names.FirstOrDefaultAsync(n => n.nature_id == natures.id && n.local_language_id == langId);
                if (natureNames == null)
                {
                    natureNames = await _pokedexContext.Nature_names.FirstOrDefaultAsync(n => n.nature_id == natures.id && n.local_language_id == (int)Lang.en);
                }
                if (natureNames != null)
                {
                    Stats? increasedStatIdentifier = await _pokedexContext.Stats.FirstOrDefaultAsync(s => s.id == natures.increased_stat_id);
                    Stats? decreasedStatIdentifier = await _pokedexContext.Stats.FirstOrDefaultAsync(s => s.id == natures.decreased_stat_id);
                    Stat_names? increasedStatName = await _pokedexContext.Stat_names.FirstOrDefaultAsync(s => s.stat_id == natures.increased_stat_id && s.local_language_id == natureNames.local_language_id);
                    Stat_names? decreasedStatName = await _pokedexContext.Stat_names.FirstOrDefaultAsync(s => s.stat_id == natures.decreased_stat_id && s.local_language_id == natureNames.local_language_id);
                    if (increasedStatIdentifier != null && decreasedStatIdentifier != null && decreasedStatName != null && decreasedStatName != null)
                    {
                        nature = new NatureDTO(
                            new LocalizedText(natureNames.name, await GetLangIdentifier(natureNames.local_language_id)),
                            natures.identifier,
                            new StatDTO(increasedStatIdentifier.identifier, new LocalizedText(increasedStatName.name, await GetLangIdentifier(increasedStatName.local_language_id)), 0),
                            new StatDTO(decreasedStatIdentifier.identifier, new LocalizedText(decreasedStatName.name, await GetLangIdentifier(decreasedStatName.local_language_id)), 0));
                    }
                }
            }
            return nature;
        }

        public async Task<MoveDTO?> GetMoveByIdentifier(string identifier, int langId)
        {
            Moves? moves = await _pokedexContext.Moves.FirstOrDefaultAsync(m => m.identifier.Equals(identifier));
            if (moves != null)
            {
                Move_names? moveNames = await _pokedexContext.Move_names.FirstOrDefaultAsync(m => m.move_id == moves.id && m.local_language_id == langId);
                if (moveNames == null)
                {
                    moveNames = await _pokedexContext.Move_names.FirstOrDefaultAsync(m => m.move_id == moves.id && m.local_language_id == (int)Lang.en);
                }
                if (moveNames != null)
                {
                    return await GetMoveByName(moveNames.name, moveNames.local_language_id);
                }
            }
            return null;
        }

        public async Task<MoveDTO?> GetMoveByName(string name, int langId)
        {
            MoveDTO? move = null;
            Move_names? moveNames = await _pokedexContext.Move_names.FirstOrDefaultAsync(m => m.name == name);
            if (moveNames != null)
            {
                Move_names? localizedMoveNames = await _pokedexContext.Move_names.FirstOrDefaultAsync(m => m.move_id == moveNames.move_id && m.local_language_id == langId);
                if (localizedMoveNames == null)
                {
                    localizedMoveNames = await _pokedexContext.Move_names.FirstOrDefaultAsync(m => m.move_id == moveNames.move_id && m.local_language_id == (int)Lang.en);
                }
                Moves? moves = await _pokedexContext.Moves.FirstOrDefaultAsync(m => m.id == moveNames.move_id);
                if (moves != null)
                {
                    Types? type = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.id == moves.type_id);
                    Type_names? typeName = await _pokedexContext.Type_names.FirstOrDefaultAsync(t => t.type_id == moves.type_id && t.local_language_id == localizedMoveNames.local_language_id);
                    if (typeName == null)
                    {
                        typeName = await _pokedexContext.Type_names.FirstOrDefaultAsync(t => t.type_id == moves.type_id && t.local_language_id == (int)Lang.en);
                    }
                    Move_damage_class_prose? damageClass = await _pokedexContext.Move_damage_class_prose.FirstOrDefaultAsync(d => d.move_damage_class_id == moves.damage_class_id && d.local_language_id == (int)Lang.en);
                    Move_target_prose? target = await _pokedexContext.Move_target_prose.FirstOrDefaultAsync(t => t.move_target_id == moves.target_id && t.local_language_id == localizedMoveNames.local_language_id);
                    if (target == null)
                    {
                        target = await _pokedexContext.Move_target_prose.FirstOrDefaultAsync(t => t.move_target_id == moves.target_id && t.local_language_id == (int)Lang.en);
                    }
                    Move_effect_prose? effect = await _pokedexContext.Move_effect_prose.FirstOrDefaultAsync(e => e.move_effect_id == moves.effect_id && e.local_language_id == localizedMoveNames.local_language_id);
                    if (effect == null)
                    {
                        effect = await _pokedexContext.Move_effect_prose.FirstOrDefaultAsync(e => e.move_effect_id == moves.effect_id && e.local_language_id == (int)Lang.en);
                    }
                    Move_meta? meta = await _pokedexContext.Move_meta.FirstOrDefaultAsync(m => m.move_id == moves.id);
                    Move_meta_stat_changes? metaStatChange = await _pokedexContext.Move_meta_stat_changes.FirstOrDefaultAsync(s => s.move_id == moves.id);
                    StatChange statChange = null;
                    if (metaStatChange != null)
                    {
                        Stat_names? metaStatName = await _pokedexContext.Stat_names.FirstOrDefaultAsync(s => s.stat_id == metaStatChange.stat_id && s.local_language_id == (int)Lang.en);
                        Stats? metaStat = await _pokedexContext.Stats.FirstOrDefaultAsync(s => s.id == metaStatChange.stat_id);
                        statChange = new StatChange
                        {
                            Stat = new StatDTO(metaStat.identifier, new LocalizedText(metaStatName.name, await GetLangIdentifier(metaStatName.local_language_id)), null),
                            Change = metaStatChange.change,
                            ChangeChance = meta.stat_chance
                        };
                    }

                    move = new MoveDTO
                    {
                        Identifier = moves.identifier,
                        Name = new LocalizedText(localizedMoveNames.name, await GetLangIdentifier(localizedMoveNames.local_language_id)),
                        PokeType = new PokeTypeWithEffectivenessDTO(
                            type.identifier,
                            new LocalizedText(typeName.name, await GetLangIdentifier(typeName.local_language_id)),
                            await GetTypeEffectivenessAttack((int)typeName.type_id, typeName.local_language_id),
                            await GetTypeEffectivenessDefense((int)typeName.type_id, typeName.local_language_id)),
                        DamageClass = new MoveDamageClass
                        {
                            Name = damageClass.name,
                            Description = damageClass.description,
                            IconPath = $"https://localhost:7134/images/sprites/damage-class/{damageClass.name}.png"
                        },
                        Power = moves.power,
                        Pp = moves.pp,
                        Accuracy = moves.accuracy,
                        Priority = moves.priority,
                        Target = target != null ? new MoveTarget
                        {
                            Name = target.name,
                            Description = new LocalizedText(Formatter.FormatProse(target.description), await GetLangIdentifier(target.local_language_id))
                        } : null,
                        Effect = effect != null ? new MoveEffect
                        {
                            Short = new LocalizedText(Formatter.FormatProse(effect.short_effect, new string[] { moves.effect_chance.ToString() }), await GetLangIdentifier(effect.local_language_id)),
                            Long = new LocalizedText(Formatter.FormatProse(effect.effect, new string[] { moves.effect_chance.ToString() }), await GetLangIdentifier(effect.local_language_id)),
                            Chance = moves.effect_chance
                        } : null,
                        Meta = new Metadata
                        {
                            MinHits = meta?.min_hits,
                            MaxHits = meta?.max_hits,
                            MinTurns = meta?.min_turns,
                            MaxTurns = meta?.max_turns,
                            Drain = meta?.drain,
                            Healing = meta?.healing,
                            CritRate = meta?.crit_rate,
                            StatusChance = meta?.ailment_chance,
                            FlinchChance = meta?.flinch_chance,
                            StatChange = statChange,
                        }
                    };
                }
            }
            return move;
        }

        public async Task<List<TagDTO>> GetPokemonMoves(string id, int langId)
        {
            List<TagDTO> moveDTOs = new List<TagDTO>();
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
                            if(moveNames == null)
                            {
                                moveNames = await _pokedexContext.Move_names.FirstOrDefaultAsync(m => m.move_id == moves.id && m.local_language_id == (int)Lang.en);
                            }
                            if (moveNames != null)
                            {
                                Types? targetType = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.id == moves.type_id);
                                if (targetType != null)
                                {
                                    var pathStart = "https://localhost:7134/images/sprites/types/generation-viii/";
                                    moveDTOs.Add(new TagDTO(moveNames.name, moves.identifier, icon: $"{pathStart}{targetType.identifier}.png"));
                                }
                                else
                                {
                                    moveDTOs.Add(new TagDTO(moveNames.name, moves.identifier));
                                }
                            }
                        }
                    }
                }
            }
            return moveDTOs.OrderBy(m => m.Name).ToList();
        }

        public async Task<string?> GetStatNameByIdentifier(string identifier, int langId)
        {
            List<Stats> stats = await _pokedexContext.Stats.Where(s => s.identifier == identifier).ToListAsync();
            if (stats.Count > 0)
            {
                Stat_names? stat_names = await _pokedexContext.Stat_names.FirstOrDefaultAsync(s => s.stat_id == stats[0].id && s.local_language_id == (int)Lang.en);
                if (stat_names != null)
                {
                    return stat_names.name;
                }
            }
            return null;
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
            Types? targetType = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.id == id);
            if (targetType != null)
            {
                Type_names? targetTypeName = await _pokedexContext.Type_names.FirstOrDefaultAsync(t => t.type_id == targetType.id && t.local_language_id == langId);
                if (targetTypeName == null)
                {
                    targetTypeName = await _pokedexContext.Type_names.FirstOrDefaultAsync(t => t.type_id == targetType.id && t.local_language_id == (int)Lang.en);
                }
                if (targetTypeName != null)
                {
                    pokeType = new PokeTypeDTO(targetType.identifier, new LocalizedText(targetTypeName.name, await GetLangIdentifier(targetTypeName.local_language_id)), teraType);
                }
            }
            return pokeType;
        }

        public async Task<PokeTypeDTO?> GetTypeByIdentifier(string identifier, bool teraType, int langId)
        {
            PokeTypeDTO? pokeType = null;
            Types? targetType = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.identifier == identifier);
            if (targetType != null)
            {
                Type_names? targetTypeName = await _pokedexContext.Type_names.FirstOrDefaultAsync(t => t.type_id == targetType.id && t.local_language_id == langId);
                if (targetTypeName == null)
                {
                    targetTypeName = await _pokedexContext.Type_names.FirstOrDefaultAsync(t => t.type_id == targetType.id && t.local_language_id == (int)Lang.en);
                }
                if (targetTypeName != null)
                {
                    pokeType = new PokeTypeDTO(targetType.identifier, new LocalizedText(targetTypeName.name, await GetLangIdentifier(targetTypeName.local_language_id)), teraType);
                }
            }
            return pokeType;
        }

        private async Task<PokeTypesWithEffectivenessDTO> GetPokemonTypesWithEffectiveness(int id, int langId)
        {
            PokeTypeWithEffectivenessDTO? type1 = null;
            Pokemon_types? pokemonType1 = await _pokedexContext.Pokemon_types.FirstOrDefaultAsync(t => t.pokemon_id == id && t.slot == 1);
            if (pokemonType1 != null)
            {
                type1 = GetTypeWithEffectivenessById(pokemonType1.type_id, langId).Result;
            }
            PokeTypeWithEffectivenessDTO? type2 = null;
            Pokemon_types? pokemonType2 = await _pokedexContext.Pokemon_types.FirstOrDefaultAsync(t => t.pokemon_id == id && t.slot == 2);
            if (pokemonType2 != null)
            {
                type2 = GetTypeWithEffectivenessById(pokemonType2.type_id, langId).Result;
            }
            PokeTypesWithEffectivenessDTO pokeTypes = new PokeTypesWithEffectivenessDTO(type1, type2);
            return pokeTypes;
        }

        private async Task<PokeTypeWithEffectivenessDTO?> GetTypeWithEffectivenessById(int id, int langId)
        {
            PokeTypeWithEffectivenessDTO? pokeType = null;
            Types? targetType = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.id == id);
            if (targetType != null)
            {
                Type_names? targetTypeName = await _pokedexContext.Type_names.FirstOrDefaultAsync(t => t.type_id == targetType.id && t.local_language_id == langId);
                if (targetTypeName == null)
                {
                    targetTypeName = await _pokedexContext.Type_names.FirstOrDefaultAsync(t => t.type_id == targetType.id && t.local_language_id == (int)Lang.en);
                }
                if (targetTypeName != null)
                {
                    pokeType = new PokeTypeWithEffectivenessDTO(
                        targetType.identifier, 
                        new LocalizedText(targetTypeName.name, await GetLangIdentifier(targetTypeName.local_language_id)),
                        GetTypeEffectivenessAttack(targetType.id, langId).Result,
                        GetTypeEffectivenessDefense(targetType.id, langId).Result);
                }
            }
            return pokeType;
        }

        public async Task<PokeTypeWithEffectivenessDTO?> GetTypeWithEffectivenessByIdentifier(string identifier, int langId, bool teraType = false)
        {
            PokeTypeWithEffectivenessDTO? pokeType = null;
            Types? targetType = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.identifier == identifier);

            if (targetType != null)
            {
                Type_names? targetTypeName = await _pokedexContext.Type_names.FirstOrDefaultAsync(t => t.type_id == targetType.id && t.local_language_id == langId);
                if (targetTypeName == null)
                {
                    targetTypeName = await _pokedexContext.Type_names.FirstOrDefaultAsync(t => t.type_id == targetType.id && t.local_language_id == (int)Lang.en);
                }
                if (targetTypeName != null)
                {
                    pokeType = new PokeTypeWithEffectivenessDTO(
                        targetType.identifier,
                        new LocalizedText(targetTypeName.name, await GetLangIdentifier(targetTypeName.local_language_id)),
                        await GetTypeEffectivenessAttack(targetType.id, langId),
                        await GetTypeEffectivenessDefense(targetType.id, langId), teraType);
                }
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
                    Types? targetType = await _pokedexContext.Types.FirstOrDefaultAsync(t =>t.id == typeEfficacy.target_type_id);
                    Type_names? targetTypeName = await _pokedexContext.Type_names.FirstOrDefaultAsync(t => t.type_id == targetType.id && t.local_language_id == langId);
                    if (targetTypeName == null)
                    {
                        targetTypeName = await _pokedexContext.Type_names.FirstOrDefaultAsync(t => t.type_id == targetType.id && t.local_language_id == (int)Lang.en);
                    }
                    if (targetType != null && targetTypeName != null)
                    {
                        allValues.Add(new (new PokeTypeDTO(targetType.identifier, new LocalizedText(targetTypeName.name, await GetLangIdentifier(targetTypeName.local_language_id))),
                            typeEfficacy.damage_factor / (double)100));
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
                    Types? targetType = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.id == typeEfficacy.damage_type_id);
                    Type_names? targetTypeName = await _pokedexContext.Type_names.FirstOrDefaultAsync(t => t.type_id == typeEfficacy.damage_type_id && t.local_language_id == langId);
                    if (targetTypeName == null)
                    {
                        targetTypeName = await _pokedexContext.Type_names.FirstOrDefaultAsync(t => t.type_id == typeEfficacy.damage_type_id && t.local_language_id == (int)Lang.en);
                    }
                    if (targetType != null && targetTypeName != null)
                    {
                        allValues.Add(new(new PokeTypeDTO(targetType.identifier, new LocalizedText(targetTypeName.name, await GetLangIdentifier(targetTypeName.local_language_id))),
                            typeEfficacy.damage_factor / (double)100));
                    }
                }
                effectiveness = new EffectivenessDTO(allValues);
            }
            return effectiveness;
        }

        public async Task<List<TagDTO>> QueryPokemonsByName(string key, int langId)
        {
            List<TagDTO> queryResults = new List<TagDTO>();
            List<Pokemon_species_names> pokemonNames = await _pokedexContext.Pokemon_species_names.Where(p => p.name.Contains(key) && p.local_language_id == langId).ToListAsync();
            if (pokemonNames != null && pokemonNames.Count > 0)
            {
                foreach (var pokemonName in pokemonNames)
                {
                    queryResults.Add(new TagDTO(pokemonName.name, pokemonName.pokemon_species_id.ToString(), type: "pokemon",
                        icon: $"https://localhost:7134/images/sprites/pokemon/{pokemonName.pokemon_species_id}.png"));      
                }
            }
            return queryResults;
        }

        public async Task<List<TagDTO>> QueryMovesByName(string key, int langId)
        {
            List<TagDTO> queryResults = new List<TagDTO>();
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
                            queryResults.Add(new TagDTO(moveName.name, moves.identifier, type: "move", icon: $"{pathStart}{targetType.identifier}.png"));
                        }
                        else
                        {
                            queryResults.Add(new TagDTO(moveName.name, moves.identifier, type: "move"));
                        }
                    }
                    else
                    {
                        queryResults.Add(new TagDTO(moveName.name, moves.identifier, type: "move"));
                    }
                }
            }
            return queryResults;
        }

        public async Task<List<TagDTO>> QueryItemsByName(string key, int langId)
        {
            List<TagDTO> queryResults = new List<TagDTO>();
            List<Item_names> itemNames = await _pokedexContext.Item_names.Where(i => i.name.Contains(key) && i.local_language_id == langId).ToListAsync();
            if (itemNames != null && itemNames.Count > 0)
            {
                foreach (var itemName in itemNames)
                {
                    Items? items = await _pokedexContext.Items.FirstOrDefaultAsync(i => i.Id == itemName.item_id);
                    if (items != null)
                    {
                        string pathStart = "https://localhost:7134/images/sprites/items/";
                        queryResults.Add(new TagDTO(itemName.name, items.Identifier, type: "item", icon: $"{pathStart}{items.Identifier}.png"));
                    }
                    else
                    {
                        queryResults.Add(new TagDTO(itemName.name, items.Identifier, type: "item"));
                    }
                }
            }
            return queryResults;
        }

        public async Task<List<TagDTO>> QueryAbilitiesByName(string key, int langId)
        {
            List<TagDTO> queryResults = new List<TagDTO>();
            List<Ability_names> abilityNames = await _pokedexContext.Ability_names.Where(i => i.name.Contains(key) && i.local_language_id == langId).ToListAsync();
            if (abilityNames != null && abilityNames.Count > 0)
            {
                foreach (var abilityName in abilityNames)
                {
                    queryResults.Add(new TagDTO(abilityName.name, abilityName.ability_id.ToString()));
                }
            }
            return queryResults;
        }

        public async Task<List<TagDTO>> QueryNaturesByName(string key, int langId)
        {
            List<TagDTO> queryResults = new List<TagDTO>();
            List<Nature_names> natureNames = await _pokedexContext.Nature_names.Where(i => i.name.Contains(key) && i.local_language_id == langId).ToListAsync();
            if (natureNames == null)
            {
                natureNames = await _pokedexContext.Nature_names.Where(i => i.name.Contains(key) && i.local_language_id == (int)Lang.en).ToListAsync();
            }
            if (natureNames != null && natureNames.Count > 0)
            {
                foreach (var natureName in natureNames)
                {
                    queryResults.Add(new TagDTO(natureName.name, natureName.nature_id.ToString()));
                }
            }
            return queryResults;
        }

        public async Task<List<TagDTO>> QueryAllNatures(int langId)
        {
            List<TagDTO> natureDTOs = new List<TagDTO>();
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
                    natureDTOs.Add(new TagDTO(natureNames.name, natures.identifier));
                }
            }
            return natureDTOs;
        }

        public async Task<List<TagDTO>> QueryTypesByName(string key, int langId, bool teraType = false)
        {
            List<TagDTO> queryResults = new List<TagDTO>();
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
                        queryResults.Add(new TagDTO(typeName.name, typeName.type_id.ToString(), icon: $"{pathStart}{types.identifier}.png"));
                    }
                    else
                    {
                        queryResults.Add(new TagDTO(typeName.name, typeName.type_id.ToString()));
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

        public async Task<List<TagDTO>> QueryAllTeraTypes(int langId)
        {
            List<TagDTO> pokeTypes = new List<TagDTO>();
            List<Types> types = await _pokedexContext.Types.ToListAsync();
            //Avoid adding last 2 types -> (unkown, shadow) UNSUPPORTED
            for (int i = 0; i < types.Count - 2; i++)
            {
                PokeTypeDTO? pokeType = await GetTypeById(types[i].id, langId, true);
                if (pokeType != null)
                {
                    pokeTypes.Add(new TagDTO(pokeType.Name.Content, pokeType.Identifier, icon: pokeType.IconPath));
                }
            }
            return pokeTypes;
        }

        public async Task<int> GetLangId(string lang)
        {
            Languages? languages = await _pokedexContext.Languages.FirstOrDefaultAsync(l => l.identifier == lang);
            if(languages != null)
            {
                return languages.id;
            }
            return 9;
        }

        public async Task<string> GetLangIdentifier(int langId)
        {
            Languages? languages = await _pokedexContext.Languages.FirstOrDefaultAsync(l => l.id == langId);
            if (languages != null)
            {
                return languages.identifier;
            }
            return "en";
        }
    }
}
