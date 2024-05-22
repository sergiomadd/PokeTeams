using api.Data;
using api.Models.DBModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Xml.Linq;
using static api.DTOs.PokemonDTOs.MoveDTO;
using api.Util;
using static Azure.Core.HttpHeader;
using static System.Net.WebRequestMethods;
using static System.Runtime.InteropServices.JavaScript.JSType;
using api.Models.DBPokedexModels;
using api.DTOs.PokemonDTOs;
using api.Models.DBPoketeamModels;
using System.Text.Json;
using api.DTOs;

namespace api.Services.PokedexService
{
    public class PokedexService : IPokedexService
    {
        private readonly PokedexContext _pokedexContext;
        private readonly LocalContext _localContext;

        public PokedexService(PokedexContext pokedexContext, LocalContext localContext)
        {
            _pokedexContext = pokedexContext;
            _localContext = localContext;
        }

        public async Task<PokemonDTO> BuildPokemonDTO(Pokemon pokemon)
        {
            PokemonDataDTO pokemonData = await GetPokemonById(pokemon.DexNumber ?? 1);
            List<MoveDTO> moves = new List<MoveDTO>
            {
                await GetMoveByIdentifier(pokemon.Move1Identifier),
                await GetMoveByIdentifier(pokemon.Move2Identifier),
                await GetMoveByIdentifier(pokemon.Move3Identifier),
                await GetMoveByIdentifier(pokemon.Move4Identifier)
            };

            return new PokemonDTO
            {
                Name = pokemonData.Name,
                Nickname = pokemon.Nickname,
                DexNumber = pokemonData.DexNumber,
                PreEvolution = pokemonData.PreEvolution,
                Evolutions = pokemonData.Evolutions,
                Types = pokemonData.Types,
                TeraType = await GetTypeWithEffectivenessByIdentifier(pokemon.TeraTypeIdentifier, true),
                Item = await GetItemByIdentifier(pokemon.ItemIdentifier),
                Ability = await GetAbilityByIdentifier(pokemon.AbilityIdentifier),
                Nature = await GetNatureByIdentifier(pokemon.NatureIdentifier),
                Moves = moves,
                Stats = pokemonData.Stats,
                ivs = pokemon.ivs != null ? JsonSerializer.Deserialize<List<StatDTO?>>(pokemon.ivs, new JsonSerializerOptions { IncludeFields = false }) : null,
                evs = pokemon.evs != null ? JsonSerializer.Deserialize<List<StatDTO?>>(pokemon.evs, new JsonSerializerOptions { IncludeFields = false }) : null,
                Level = pokemon.Level,
                Shiny = pokemon.Shiny,
                Gender = pokemon.Gender,
                Sprites = pokemonData.Sprites
            };
        }

        public async Task<MovePreviewDTO> BuildMovePreview(string identifier)
        {
            MovePreviewDTO movePreview = null;
            if (identifier == null)
            {
                return null;
            }
            Moves moves = _pokedexContext.Moves.FirstOrDefault(m => m.identifier == identifier);
            if (moves != null)
            {
                Move_names moveNames = _pokedexContext.Move_names.FirstOrDefault(m => m.move_id == moves.id && m.local_language_id == 9);
                if (moveNames != null)
                {
                    movePreview = new MovePreviewDTO(moves.identifier, moveNames.name, await GetTypeById(moves.type_id ?? 0));
                }
            }
            return movePreview;
        }

        public async Task<PokemonPreviewDTO> BuildPokemonPreviewDTO(Pokemon pokemon, EditorOptionsDTO editorOptions)
        {
            PokemonDataDTO pokemonData = await GetPokemonById(pokemon.DexNumber ?? 1);
            List<MovePreviewDTO> moves = new List<MovePreviewDTO>()
            { 
                await BuildMovePreview(pokemon.Move1Identifier),
                await BuildMovePreview(pokemon.Move2Identifier),
                await BuildMovePreview(pokemon.Move3Identifier),
                await BuildMovePreview(pokemon.Move4Identifier)
            };

            return new PokemonPreviewDTO
            {
                Name = pokemonData.Name,
                DexNumber = pokemonData.DexNumber,
                Types = await GetPokemonTypes(pokemonData.DexNumber),
                TeraType = await GetTypeByIdentifier(pokemon.TeraTypeIdentifier, true),
                Sprite = pokemonData.Sprites[int.Parse(editorOptions.PokemonSpritesGen.Identifier)],
                Shiny = pokemon.Shiny,
                Gender = pokemon.Gender,
                Moves = moves,
                Item = await GetItemByIdentifier(pokemon.ItemIdentifier),
                AbilityName = GetAbilityByIdentifier(pokemon.AbilityIdentifier).Result.Name ?? ""
            };
        }

        public async Task<PokemonDataDTO?> GetPokemonById(int id)
        {
            PokemonDataDTO pokemonData = new PokemonDataDTO(
                GetPokemonName(id),
                id,
                GetPokemonTypesWithEffectiveness(id).Result,
                GetPokemonStats(id).Result,
                _localContext.GetSprites(id),
                preEvolution: GetPokemonPreEvolution(id),
                evolutions: GetPokemonEvolutions(id));
            return pokemonData;
        }

        public async Task<PokemonDataDTO?> GetPokemonByName(string name)
        {
            /*
             * Problem: multiple pokemons with same name but different local_language_id
             * Change local_language_id to received parameter, as in used selected lang option
            */
            Pokemon_species_names? pokemonName = _pokedexContext.Pokemon_species_names.Where(p => p.name == name && p.local_language_id == 9).SingleOrDefault();
            if (pokemonName != null)
            {
                return GetPokemonById(pokemonName.pokemon_species_id).Result;
            }
            return null;
        }

        private string? GetPokemonName(int id)
        {
            Pokemon_species_names? pokemonSpeciesNames = _pokedexContext.Pokemon_species_names.FirstOrDefault(p => p.pokemon_species_id == id && p.local_language_id == 9);
            if (pokemonSpeciesNames != null)
            {
                return pokemonSpeciesNames?.name;
            }
            return null;
        }

        private async Task<PokeTypesDTO> GetPokemonTypes(int id)
        {
            PokeTypeDTO? type1 = null;
            Pokemon_types? pokemonType1 = await _pokedexContext.Pokemon_types.FindAsync(id, 1);
            if (pokemonType1 != null)
            {
                type1 = GetTypeById(pokemonType1.type_id).Result;
            }
            PokeTypeDTO? type2 = null;
            Pokemon_types? pokemonType2 = await _pokedexContext.Pokemon_types.FindAsync(id, 2);
            if (pokemonType2 != null)
            {
                type2 = GetTypeById(pokemonType2.type_id).Result;
            }
            PokeTypesDTO pokeTypes = new PokeTypesDTO
            {
                Type1 = type1,
                Type2 = type2
            };
            return pokeTypes;
        }

        private async Task<PokeTypesWithEffectivenessDTO> GetPokemonTypesWithEffectiveness(int id)
        {
            PokeTypeWithEffectivenessDTO? type1 = null;
            Pokemon_types? pokemonType1 = await _pokedexContext.Pokemon_types.FindAsync(id, 1);
            if (pokemonType1 != null)
            {
                type1 = GetTypeWithEffectivenessById(pokemonType1.type_id).Result;
            }
            PokeTypeWithEffectivenessDTO? type2 = null;
            Pokemon_types? pokemonType2 = await _pokedexContext.Pokemon_types.FindAsync(id, 2);
            if (pokemonType2 != null)
            {
                type2 = GetTypeWithEffectivenessById(pokemonType2.type_id).Result;
            }
            PokeTypesWithEffectivenessDTO pokeTypes = new PokeTypesWithEffectivenessDTO(type1, type2);
            return pokeTypes;
        }

        private async Task<List<StatDTO>> GetPokemonStats(int id)
        {
            List<StatDTO> pokeStats = new List<StatDTO>();
            for (int i = 1; i < 7; i++)
            {
                Pokemon_stats? pokemonStats = await _pokedexContext.Pokemon_stats.FindAsync(id, i);
                Stat_names? statNames = await _pokedexContext.Stat_names.FindAsync(i, 9); //change 9 to local_language_id
                Stats? stats = await _pokedexContext.Stats.FindAsync(i);
                if (pokemonStats != null && statNames != null && stats != null)
                {
                    pokeStats.Add(new StatDTO(stats.identifier, statNames.name, pokemonStats.base_stat));
                }
            }
            return pokeStats;
        }

        private PokemonDataDTO? GetPokemonPreEvolution(int id)
        {
            Pokemon_species? pokemonSpeciesPreEvolution = _pokedexContext.Pokemon_species.FirstOrDefault(p => p.id == id);
            if (pokemonSpeciesPreEvolution != null && pokemonSpeciesPreEvolution.evolves_from_species_id != null)
            {
                int newID = pokemonSpeciesPreEvolution.evolves_from_species_id ?? 0;
                return new PokemonDataDTO(GetPokemonName(newID), newID, GetPokemonTypesWithEffectiveness(newID).Result, GetPokemonStats(newID).Result, _localContext.GetSprites(newID), preEvolution: GetPokemonPreEvolution(newID));
            }
            return null;
        }

        private List<PokemonDataDTO?> GetPokemonEvolutions(int id)
        {
            List<PokemonDataDTO?> evolutions = new List<PokemonDataDTO?>();
            List<Pokemon_species?> pokemonSpeciesEvolutionList = _pokedexContext.Pokemon_species.Where(p => p.evolves_from_species_id == id).ToList();
            if (pokemonSpeciesEvolutionList.Count() > 0)
            {
                foreach (Pokemon_species pokemonSpeciesEvolution in pokemonSpeciesEvolutionList)
                {
                    if (pokemonSpeciesEvolution != null)
                    {
                        int newID = pokemonSpeciesEvolution.id;
                        evolutions.Add(new PokemonDataDTO(GetPokemonName(newID), newID, GetPokemonTypesWithEffectiveness(newID).Result, GetPokemonStats(newID).Result, _localContext.GetSprites(newID), evolutions: GetPokemonEvolutions(newID)));
                    }
                }
            }
            return evolutions;
        }

        public async Task<ItemDTO?> GetItemByName(string name)
        {
            ItemDTO? item = null;
            Item_names? itemNames = await _pokedexContext.Item_names.FindAsync(name);
            if (itemNames != null)
            {
                Item_prose? itemProse = await _pokedexContext.Item_prose.FindAsync(itemNames.item_id, 9);
                Items? items = await _pokedexContext.Items.FindAsync(itemNames.item_id);
                if (itemProse != null && items != null)
                {
                    item = new ItemDTO(items.Identifier, itemNames.name, Formatter.FormatProse(itemProse.effect));
                }
            }
            return item;
        }

        public async Task<ItemDTO?> GetItemByIdentifier(string identifier)
        {
            ItemDTO? item = null;
            Items? items = await _pokedexContext.Items.FirstOrDefaultAsync(i => i.Identifier == identifier);
            if (items != null)
            {
                Item_names? itemNames = await _pokedexContext.Item_names.FirstOrDefaultAsync(i => i.item_id == items.Id && i.local_language_id == 9);
                Item_prose? itemProse = await _pokedexContext.Item_prose.FindAsync(itemNames.item_id, 9);
                if (itemNames != null && itemProse != null)
                {
                    item = new ItemDTO(items.Identifier, itemNames.name, Formatter.FormatProse(itemProse.effect));
                }
            }
            return item;
        }

        public async Task<AbilityDTO?> GetAbilityByName(string name)
        {
            AbilityDTO? ability = null;
            Ability_names? abilityNames = await _pokedexContext.Ability_names.FindAsync(name);
            if (abilityNames != null)
            {
                Abilities? abilities = await _pokedexContext.Abilities.FirstOrDefaultAsync(a => a.id == abilityNames.ability_id);
                Ability_prose? abilityProse = await _pokedexContext.Ability_prose.FindAsync(abilityNames.ability_id, abilityNames.local_language_id); ;
                if (abilities != null && abilityProse != null)
                {
                    ability = new AbilityDTO(abilities.identifier, abilityNames.name, Formatter.FormatProse(abilityProse.effect));
                }
            }
            return ability;
        }

        public async Task<AbilityDTO?> GetAbilityByIdentifier(string identifier)
        {
            AbilityDTO? ability = null;
            Abilities? abilities = await _pokedexContext.Abilities.FirstOrDefaultAsync(a => a.identifier.Equals(identifier));
            if (abilities != null)
            {
                Ability_names? abilityNames = await _pokedexContext.Ability_names.FirstOrDefaultAsync(a => a.ability_id == abilities.id && a.local_language_id == 9);
                Ability_prose? abilityProse = await _pokedexContext.Ability_prose.FindAsync(abilities.id, 9); ;
                if (abilityNames != null && abilityProse != null)
                {
                    ability = new AbilityDTO(abilities.identifier, abilityNames.name, Formatter.FormatProse(abilityProse.effect));
                }
            }
            return ability;
        }

        public async Task<NatureDTO?> GetNatureByName(string name)
        {
            NatureDTO? nature = null;
            Nature_names? natureNames = await _pokedexContext.Nature_names.FindAsync(name);
            if (natureNames != null)
            {
                Natures? natures = await _pokedexContext.Natures.FindAsync(natureNames.nature_id);
                if (natures != null)
                {
                    Stats? increasedStatIdentifier = await _pokedexContext.Stats.FindAsync(natures.increased_stat_id);
                    Stats? decreasedStatIdentifier = await _pokedexContext.Stats.FindAsync(natures.decreased_stat_id);
                    Stat_names? increasedStatName = await _pokedexContext.Stat_names.FindAsync(natures.increased_stat_id, natureNames.local_language_id);
                    Stat_names? decreasedStatName = await _pokedexContext.Stat_names.FindAsync(natures.decreased_stat_id, natureNames.local_language_id);

                    if (increasedStatIdentifier != null && decreasedStatIdentifier != null && decreasedStatName != null && decreasedStatName != null)
                    {
                        nature = new NatureDTO(natureNames.name, natures.identifier, new StatDTO(increasedStatIdentifier.identifier, increasedStatName.name, 0), new StatDTO(decreasedStatIdentifier.identifier, decreasedStatName.name, 0));
                    }
                }
            }
            return nature;
        }

        public async Task<NatureDTO?> GetNatureByIdentifier(string identifier)
        {
            NatureDTO? nature = null;
            Natures? natures = await _pokedexContext.Natures.FirstOrDefaultAsync(n => n.identifier.Equals(identifier));
            if (natures != null)
            {
                Nature_names? natureNames = await _pokedexContext.Nature_names.FirstOrDefaultAsync(n => n.nature_id == natures.id && n.local_language_id == 9);
                if (natureNames != null)
                {
                    Stats? increasedStatIdentifier = await _pokedexContext.Stats.FindAsync(natures.increased_stat_id);
                    Stats? decreasedStatIdentifier = await _pokedexContext.Stats.FindAsync(natures.decreased_stat_id);
                    Stat_names? increasedStatName = await _pokedexContext.Stat_names.FindAsync(natures.increased_stat_id, natureNames.local_language_id);
                    Stat_names? decreasedStatName = await _pokedexContext.Stat_names.FindAsync(natures.decreased_stat_id, natureNames.local_language_id);

                    if (increasedStatIdentifier != null && decreasedStatIdentifier != null && decreasedStatName != null && decreasedStatName != null)
                    {
                        nature = new NatureDTO(natureNames.name, natures.identifier, new StatDTO(increasedStatIdentifier.identifier, increasedStatName.name, 0), new StatDTO(decreasedStatIdentifier.identifier, decreasedStatName.name, 0));
                    }
                }
            }
            return nature;
        }



        public async Task<MoveDTO?> GetMoveByIdentifier(string identifier)
        {
            Moves? moves = await _pokedexContext.Moves.FirstOrDefaultAsync(m => m.identifier.Equals(identifier));
            if (moves != null)
            {
                Move_names? moveNames = await _pokedexContext.Move_names.FirstOrDefaultAsync(m => m.move_id == moves.id && m.local_language_id == 9);
                if (moveNames != null)
                {
                    return await GetMoveByName(moveNames.name);
                }

            }
            return null;
        }

        public async Task<MoveDTO?> GetMoveByName(string name)
        {
            MoveDTO? move = null;
            Move_names? moveNames = await _pokedexContext.Move_names.FindAsync(name);
            if (moveNames != null)
            {
                Moves? moves = await _pokedexContext.Moves.FindAsync(moveNames.move_id);
                if (moves != null)
                {
                    Types? type = await _pokedexContext.Types.FindAsync(moves.type_id);
                    Type_names? typeName = await _pokedexContext.Type_names.FindAsync(moves.type_id, 9);
                    Move_damage_class_prose? damageClass = await _pokedexContext.Move_damage_class_prose.FindAsync(moves.damage_class_id, 9);
                    Move_target_prose? target = await _pokedexContext.Move_target_prose.FindAsync(moves.target_id, 9);
                    Move_effect_prose? effect = await _pokedexContext.Move_effect_prose.FindAsync(moves.effect_id, 9);
                    Move_meta? meta = await _pokedexContext.Move_meta.FindAsync(moves.id);
                    Move_meta_stat_changes? metaStatChange = await _pokedexContext.Move_meta_stat_changes.FindAsync(moves.id);
                    StatChange statChange = null;
                    if (metaStatChange != null)
                    {
                        Stat_names? metaStatName = await _pokedexContext.Stat_names.FindAsync(metaStatChange.stat_id, 9);
                        Stats? metaStat = await _pokedexContext.Stats.FindAsync(metaStatChange.stat_id);
                        statChange = new StatChange
                        {
                            Stat = new StatDTO(metaStat.identifier, metaStatName.name, null),
                            Change = metaStatChange.change,
                            ChangeChance = meta.stat_chance
                        };
                    }

                    move = new MoveDTO
                    {
                        Identifier = moves.identifier,
                        Name = name,
                        PokeType = new PokeTypeWithEffectivenessDTO(type.identifier, typeName.name, GetTypeEffectivenessAttack((int)moves.type_id).Result, GetTypeEffectivenessDefense((int)moves.type_id).Result),
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
                        Target = new MoveTarget
                        {
                            Name = target.name,
                            Description = Formatter.FormatProse(target.description)
                        },
                        Effect = new MoveEffect
                        {
                            Short = Formatter.FormatProse(effect.short_effect, new string[] { moves.effect_chance.ToString() }),
                            Long = Formatter.FormatProse(effect.effect, new string[] { moves.effect_chance.ToString() }),
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
                            StatChange = statChange,
                        }
                    };
                }
            }
            return move;
        }

        public async Task<string?> GetStatNameByIdentifier(string identifier)
        {
            List<Stats> stats = _pokedexContext.Stats.Where(s => s.identifier == identifier).ToList();
            if (stats.Count > 0)
            {
                Stat_names? stat_names = await _pokedexContext.Stat_names.FindAsync(stats[0]?.id, 9); //change for local languague id
                if (stat_names != null)
                {
                    return stat_names.name;
                }
            }
            return null;
        }

        private async Task<PokeTypeDTO?> GetTypeById(int id, bool teraType = false)
        {
            PokeTypeDTO? pokeType = null;
            Types? targetType = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.id == id);
            if (targetType != null)
            {
                Type_names? targetTypeName = await _pokedexContext.Type_names.FindAsync(targetType.id, 9);
                if (targetTypeName != null)
                {

                    pokeType = new PokeTypeDTO(targetType.identifier, targetTypeName.name, teraType);
                }
            }
            return pokeType;
        }

        private async Task<PokeTypeWithEffectivenessDTO?> GetTypeWithEffectivenessById(int id)
        {
            PokeTypeWithEffectivenessDTO? pokeType = null;
            Types? targetType = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.id == id);
            if (targetType != null)
            {
                Type_names? targetTypeName = await _pokedexContext.Type_names.FindAsync(targetType.id, 9);
                if (targetTypeName != null)
                {

                    pokeType = new PokeTypeWithEffectivenessDTO(targetType.identifier, targetTypeName.name,
                        GetTypeEffectivenessAttack(targetType.id).Result, GetTypeEffectivenessDefense(targetType.id).Result);
                }
            }
            return pokeType;
        }

        public async Task<PokeTypeDTO?> GetTypeByIdentifier(string identifier, bool teraType)
        {
            PokeTypeDTO? pokeType = null;
            Types? targetType = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.identifier == identifier);

            if (targetType != null)
            {
                Type_names? targetTypeName = await _pokedexContext.Type_names.FindAsync(targetType.id, 9);
                if (targetTypeName != null)
                {
                    pokeType = new PokeTypeDTO(targetType.identifier, targetTypeName.name, teraType);
                }
            }
            return pokeType;
        }

        public async Task<PokeTypeWithEffectivenessDTO?> GetTypeWithEffectivenessByIdentifier(string identifier, bool teraType = false)
        {
            PokeTypeWithEffectivenessDTO? pokeType = null;
            Types? targetType = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.identifier == identifier);

            if (targetType != null)
            {
                Type_names? targetTypeName = await _pokedexContext.Type_names.FindAsync(targetType.id, 9);
                if (targetTypeName != null)
                {
                    pokeType = new PokeTypeWithEffectivenessDTO(targetType.identifier, targetTypeName.name,
                        GetTypeEffectivenessAttack(targetType.id).Result, GetTypeEffectivenessDefense(targetType.id).Result, teraType);
                }
            }
            return pokeType;
        }

        public async Task<EffectivenessDTO?> GetTypeEffectivenessAttack(int id)
        {
            EffectivenessDTO effectiveness = null;
            List<Tuple<string, double>> allValues = new List<Tuple<string, double>>();
            List<Type_efficacy> typeEfficacyList = _pokedexContext.Type_efficacy.Where(t => t.damage_type_id == id && t.damage_factor != 100).ToList();
            if (typeEfficacyList != null)
            {
                foreach (var typeEfficacy in typeEfficacyList)
                {
                    Types? targetType = await _pokedexContext.Types.FindAsync(typeEfficacy.target_type_id);
                    Type_names? targetTypeName = await _pokedexContext.Type_names.FindAsync(targetType.id, 9);
                    if (targetType != null && targetTypeName != null)
                    {
                        allValues.Add(new(targetType.identifier, (double)typeEfficacy.damage_factor / (double)100));
                    }
                }
                effectiveness = new EffectivenessDTO(allValues);
            }
            return effectiveness;
        }

        public async Task<EffectivenessDTO?> GetTypeEffectivenessDefense(int id)
        {
            EffectivenessDTO effectiveness = null;
            List<Tuple<string, double>> allValues = new List<Tuple<string, double>>(); ;
            List<Type_efficacy> typeEfficacyList = _pokedexContext.Type_efficacy.Where(t => t.target_type_id == id && t.damage_factor != 100).ToList();
            if (typeEfficacyList != null)
            {
                foreach (var typeEfficacy in typeEfficacyList)
                {
                    Types? targetType = await _pokedexContext.Types.FindAsync(typeEfficacy.damage_type_id);
                    Type_names? targetTypeName = await _pokedexContext.Type_names.FindAsync(typeEfficacy.damage_type_id, 9);
                    if (targetType != null && targetTypeName != null)
                    {
                        allValues.Add(new(targetType.identifier, (double)typeEfficacy.damage_factor / (double)100));
                    }
                }
                effectiveness = new EffectivenessDTO(allValues);
            }
            return effectiveness;
        }

        public List<TagDTO> QueryPokemonsByName(string key)
        {
            List<TagDTO> queryResults = new List<TagDTO>();
            List<Pokemon_species_names> pokemonNames = _pokedexContext.Pokemon_species_names
                .Where(p => p.name.Contains(key) && p.local_language_id == 9).ToList();
            if (pokemonNames != null && pokemonNames.Count > 0)
            {
                pokemonNames.ForEach(pokemonName =>
                {
                    queryResults.Add(new TagDTO(pokemonName.name, pokemonName.pokemon_species_id.ToString(),
                        icon: $"https://localhost:7134/images/sprites/pokemon/{pokemonName.pokemon_species_id}.png"));
                });
            }
            return queryResults;
        }


        public List<TagDTO> QueryMovesByName(string key)
        {
            List<TagDTO> queryResults = new List<TagDTO>();
            List<Move_names> moveNames = _pokedexContext.Move_names
                .Where(m => m.name.Contains(key) && m.local_language_id == 9).ToList();
            if (moveNames != null && moveNames.Count > 0)
            {
                moveNames.ForEach(moveName =>
                {
                    Moves? moves = _pokedexContext.Moves.Find(moveName.move_id);
                    if (moves != null)
                    {
                        Types? targetType = _pokedexContext.Types.FirstOrDefault(t => t.id == moves.type_id);
                        if (targetType != null)
                        {
                            var pathStart = "https://localhost:7134/images/sprites/types/generation-viii/";
                            queryResults.Add(new TagDTO(moveName.name, moves.identifier, icon: $"{pathStart}{targetType.identifier}.png"));
                        }
                        else
                        {
                            queryResults.Add(new TagDTO(moveName.name, moves.identifier));
                        }
                    }
                    else
                    {
                        queryResults.Add(new TagDTO(moveName.name, moves.identifier));
                    }
                });
            }
            return queryResults;
        }

        public List<TagDTO> QueryItemsByName(string key)
        {
            List<TagDTO> queryResults = new List<TagDTO>();
            List<Item_names> itemNames = _pokedexContext.Item_names
                .Where(i => i.name.Contains(key) && i.local_language_id == 9).ToList();
            if (itemNames != null && itemNames.Count > 0)
            {
                itemNames.ForEach(itemName =>
                {
                    Items items = _pokedexContext.Items.FirstOrDefault(i => i.Id == itemName.item_id);
                    if (items != null)
                    {
                        string pathStart = "https://localhost:7134/images/sprites/items/";
                        queryResults.Add(new TagDTO(itemName.name, items.Identifier, icon: $"{pathStart}{items.Identifier}.png"));
                    }
                    else
                    {
                        queryResults.Add(new TagDTO(itemName.name, items.Identifier));
                    }
                });
            }
            return queryResults;
        }

        public async Task<List<PokeTypeDTO>> GetAllTypes()
        {
            List<PokeTypeDTO> pokeTypes = new List<PokeTypeDTO>();
            List<Types> types = _pokedexContext.Types.ToList();
            foreach(Types type in types)
            {
                pokeTypes.Add(await GetTypeById(type.id));
            }
            return pokeTypes;
        }

        public async Task<List<PokeTypeDTO>> GetAllTeraTypes()
        {
            List<PokeTypeDTO> pokeTypes = new List<PokeTypeDTO>();
            List<Types> types = _pokedexContext.Types.ToList();
            foreach (Types type in types)
            {
                pokeTypes.Add(await GetTypeById(type.id, true));
            }
            return pokeTypes;
        }

    }
}
