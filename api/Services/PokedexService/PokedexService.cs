using api.Data;
using api.Models.DBModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Xml.Linq;
using static api.Models.DTOs.PokemonDTOs.MoveDTO;
using api.Util;
using static Azure.Core.HttpHeader;
using static System.Net.WebRequestMethods;
using static System.Runtime.InteropServices.JavaScript.JSType;
using api.Models;
using api.Models.DBPokedexModels;
using api.Models.DTOs.PokemonDTOs;

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

        public async Task<PokemonData?> GetPokemonById(int id)
        {
            PokemonData pokemonData = new PokemonData(
                GetPokemonName(id),
                id,
                GetPokemonTypes(id).Result,
                GetPokemonStats(id).Result,
                _localContext.GetSprites(id),
                preEvolution: GetPokemonPreEvolution(id),
                evolutions: GetPokemonEvolutions(id));
            return pokemonData;
        }

        public async Task<PokemonData?> GetPokemonByName(string name)
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
            if(pokemonSpeciesNames != null)
            {
                return pokemonSpeciesNames?.name;
            }
            return null;
        }

        private async Task<PokeTypes> GetPokemonTypes(int id)
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
            PokeTypes pokeTypes = new PokeTypes(type1, type2);
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

        private PokemonData? GetPokemonPreEvolution(int id)
        {
            Pokemon_species? pokemonSpeciesPreEvolution = _pokedexContext.Pokemon_species.FirstOrDefault(p => p.id == id);
            if (pokemonSpeciesPreEvolution != null && pokemonSpeciesPreEvolution.evolves_from_species_id != null)
            {
                int newID = pokemonSpeciesPreEvolution.evolves_from_species_id ?? 0;
                return new PokemonData(GetPokemonName(newID), newID, GetPokemonTypes(newID).Result, GetPokemonStats(newID).Result, _localContext.GetSprites(newID), preEvolution: GetPokemonPreEvolution(newID));
            }
            return null;
        }

        private List<PokemonData?> GetPokemonEvolutions(int id)
        {
            List<PokemonData?> evolutions = new List<PokemonData?>();
            List<Pokemon_species?> pokemonSpeciesEvolutionList = _pokedexContext.Pokemon_species.Where(p => p.evolves_from_species_id == id).ToList();
            if(pokemonSpeciesEvolutionList.Count() > 0)
            {
                foreach(Pokemon_species pokemonSpeciesEvolution in pokemonSpeciesEvolutionList)
                {
                    if (pokemonSpeciesEvolution != null)
                    {
                        int newID = pokemonSpeciesEvolution.id;
                        evolutions.Add(new PokemonData(GetPokemonName(newID), newID, GetPokemonTypes(newID).Result, GetPokemonStats(newID).Result, _localContext.GetSprites(newID), evolutions: GetPokemonEvolutions(newID)));
                    }
                }
            }
            return evolutions;
        }

        public async Task<ItemDTO?> GetItemByName(string name)
        {
            ItemDTO? item = null;
            Item_names? itemNames = await _pokedexContext.Item_names.FindAsync(name);
            if(itemNames != null)
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
                if(abilities != null && abilityProse != null)
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
                    ability = new AbilityDTO( abilities.identifier, abilityNames.name, Formatter.FormatProse(abilityProse.effect));
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
                        Name = name,
                        PokeType = new PokeTypeDTO(type.identifier, typeName.name, GetTypeEffectivenessAttack((int)moves.type_id).Result, GetTypeEffectivenessDefense((int)moves.type_id).Result),
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

        private async Task<PokeTypeDTO?> GetTypeById(int id)
        {
            PokeTypeDTO? pokeType = null;
            Types? targetType = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.id == id);
            if (targetType != null)
            {
                Type_names? targetTypeName = await _pokedexContext.Type_names.FindAsync(targetType.id, 9);
                if (targetTypeName != null)
                {

                    pokeType = new PokeTypeDTO(targetType.identifier, targetTypeName.name,
                        GetTypeEffectivenessAttack(targetType.id).Result, GetTypeEffectivenessDefense(targetType.id).Result);
                }
            }
            return pokeType;
        }

        public async Task<PokeTypeDTO?> GetTypeByIdentifier(string identifier)
        {
            PokeTypeDTO? pokeType = null;
            Types? targetType = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.identifier == identifier);

            if (targetType != null)
            {
                Type_names? targetTypeName = await _pokedexContext.Type_names.FindAsync(targetType.id, 9);
                if (targetTypeName != null)
                {
                    pokeType = new PokeTypeDTO(targetType.identifier, targetTypeName.name,
                        GetTypeEffectivenessAttack(targetType.id).Result, GetTypeEffectivenessDefense(targetType.id).Result);
                }
            }
            return pokeType;
        }

        public async Task<PokeTypeDTO?> GetTeraTypeByIdentifier(string identifier)
        {
            PokeTypeDTO? pokeType = null;
            Types? targetType = await _pokedexContext.Types.FirstOrDefaultAsync(t => t.identifier == identifier);

            if (targetType != null)
            {
                Type_names? targetTypeName = await _pokedexContext.Type_names.FindAsync(targetType.id, 9);
                if (targetTypeName != null)
                {
                    pokeType = new PokeTypeDTO(targetType.identifier, targetTypeName.name,
                        GetTypeEffectivenessAttack(targetType.id).Result, GetTypeEffectivenessDefense(targetType.id).Result, true);
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
                foreach(var typeEfficacy in typeEfficacyList)
                {
                    Types? targetType = await _pokedexContext.Types.FindAsync(typeEfficacy.target_type_id);
                    Type_names? targetTypeName = await _pokedexContext.Type_names.FindAsync(targetType.id, 9);
                    if (targetType != null && targetTypeName != null)
                    {
                        allValues.Add(new (targetType.identifier, (double)typeEfficacy.damage_factor / (double)100));
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
                        allValues.Add(new (targetType.identifier, (double)typeEfficacy.damage_factor / (double)100));
                    }
                }
                effectiveness = new EffectivenessDTO(allValues);
            }
            return effectiveness;
        }
    }
}
