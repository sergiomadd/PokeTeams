using api.Data;
using api.Models;
using api.Models.DBModels;
using Microsoft.EntityFrameworkCore;
using static api.Models.Move;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
            Pokemon? pokemonData = null;
            Pokemon_species_names? pokemonName = await _context.Pokemon_species_names.FindAsync(name);
            if (pokemonName != null)
            {
                List<PokeType> pokeTypes = new List<PokeType>();
                Pokemon_types? pokemonType1 = await _context.Pokemon_types.FindAsync(pokemonName.pokemon_species_id ,1);
                if(pokemonType1 != null)
                {
                    Types? type1 = await _context.Types.FindAsync(pokemonType1.type_id);
                    Type_names? typeName1 = await _context.Type_names.FindAsync(pokemonType1.type_id, 9);
                    pokeTypes.Add(new PokeType(type1.identifier, typeName1.name));

                    Pokemon_types? pokemonType2 = await _context.Pokemon_types.FindAsync(pokemonName.pokemon_species_id, 2);
                    if(pokemonType2 != null)
                    {
                        Types? type2 = await _context.Types.FindAsync(pokemonType2.type_id);
                        Type_names? typeName2 = await _context.Type_names.FindAsync(pokemonType2.type_id, 9);
                        pokeTypes.Add(new PokeType(type2.identifier, typeName2.name));
                    }
                }

                List<Stat> pokeStats = new List<Stat>();
                for(int i=1; i<7;i++)
                {
                    Pokemon_stats? pokemonStats = await _context.Pokemon_stats.FindAsync(pokemonName.pokemon_species_id, i);
                    Stat_names? statNames = await _context.Stat_names.FindAsync(i, 9); //change 9 to local_language_id
                    Stats? stats = await _context.Stats.FindAsync(i);
                    if (pokemonStats != null && statNames != null && stats != null) 
                    {
                        pokeStats.Add(new Stat
                        {
                            Identifier = stats.identifier,
                            Name = statNames.name,
                            BaseStat = pokemonStats.base_stat
                        });
                    }
                }
                pokemonData = new Pokemon(pokemonName.name, pokemonName.pokemon_species_id, pokeTypes, pokeStats);
            }
            return pokemonData;
        }


        public async Task<Item?> GetItemByName(string name)
        {
            //Problem: only works with exact match (case sensitive name)

            Item? item = null;
            Item_names? itemNames = await _context.Item_names.FindAsync(name);
            if(itemNames != null)
            {
                Item_prose? itemProse = await _context.Item_prose.FindAsync(itemNames.item_id);
                if (itemProse != null)
                {
                    item = new Item(itemNames.name, itemProse.effect);
                }

            }
            return item;
        }

        public async Task<Ability?> GetAbilityByName(string name)
        {
            Ability? ability = null;
            Ability_names? abilityNames = await _context.Ability_names.FindAsync(name);
            if (abilityNames != null)
            {
                Ability_prose? abilityProse = await _context.Ability_prose.FindAsync(abilityNames.ability_id, abilityNames.local_language_id); ;
                if(abilityProse != null)
                {
                    ability = new Ability(abilityNames.name, abilityProse.effect);
                }
            }
            return ability;
        }

        public async Task<Nature?> GetNatureByName(string name)
        {
            Nature? nature = null;
            Nature_names? natureNames = await _context.Nature_names.FindAsync(name);
            if (natureNames != null)
            {
                Natures? natures = await _context.Natures.FindAsync(natureNames.nature_id);
                if (natures != null)
                {
                    Stat_names? increasedStatName = await _context.Stat_names.FindAsync(natures.increased_stat_id, natureNames.local_language_id);
                    Stat_names? decreasedStatName = await _context.Stat_names.FindAsync(natures.decreased_stat_id, natureNames.local_language_id);
                    if(increasedStatName != null && decreasedStatName != null)
                    {
                        nature = new Nature(natureNames.name, increasedStatName.name, decreasedStatName.name);
                    }
                }
            }
            return nature;
        }

        public async Task<Move?> GetMoveByName(string name)
        {
            Move? move = null;
            Move_names? moveNames = await _context.Move_names.FindAsync(name);
            if (moveNames != null)
            {
                Moves? moves = await _context.Moves.FindAsync(moveNames.move_id);
                if (moves != null)
                {
                    Types? type = await _context.Types.FindAsync(moves.type_id);
                    Type_names? typeName = await _context.Type_names.FindAsync(moves.type_id, 9);
                    Move_damage_class_prose? damageClass = await _context.Move_damage_class_prose.FindAsync(moves.damage_class_id, 9);
                    Move_target_prose? target = await _context.Move_target_prose.FindAsync(moves.target_id, 9);
                    Move_effect_prose? effect = await _context.Move_effect_prose.FindAsync(moves.effect_id, 9);
                    Move_meta? meta = await _context.Move_meta.FindAsync(moves.id);
                    Move_meta_stat_changes? metaStatChange = await _context.Move_meta_stat_changes.FindAsync(moves.id);
                    StatChange statChange = null;
                    if (metaStatChange != null)
                    {
                        Stat_names? metaStatName = await _context.Stat_names.FindAsync(metaStatChange.stat_id, 9);
                        Stats? metaStat = await _context.Stats.FindAsync(metaStatChange.stat_id);
                        statChange = new StatChange
                        {
                            Stat = new Stat
                            {
                                Identifier = metaStat.identifier,
                                Name = metaStatName.name,
                                BaseStat = null
                            },
                            Change = metaStatChange.change,
                            StatChance = meta.stat_chance
                        }; 
                    }

                    move = new Move
                    {
                        Name = name,
                        PokeType = new PokeType(type.identifier, typeName.name),
                        DamageClass = new MoveDamageClass
                        {
                            Name = damageClass.name,
                            Description = damageClass.description
                        },
                        Power = moves.power,
                        Pp = moves.pp,
                        Accuracy = moves.accuracy,
                        Priority = moves.priority,
                        Target = new MoveTarget
                        {
                            Name = target.name,
                            Description = target.description
                        },
                        Effect = new MoveEffect
                        {
                            ShortEffect = effect.short_effect,
                            LongEffect = effect.effect,
                            EffectChance = moves.effect_chance
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
    }
}
