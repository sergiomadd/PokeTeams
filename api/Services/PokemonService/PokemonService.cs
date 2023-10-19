using api.Data;
using api.Models;
using api.Models.DBModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Xml.Linq;
using static api.Models.Move;
using static System.Net.WebRequestMethods;
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
                    pokeTypes.Add(GetTypeById(pokemonType1.type_id).Result);
                }
                Pokemon_types? pokemonType2 = await _context.Pokemon_types.FindAsync(pokemonName.pokemon_species_id, 2);
                if (pokemonType2 != null)
                {
                    pokeTypes.Add(GetTypeById(pokemonType2.type_id).Result);
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
                pokemonData = new Pokemon(pokemonName.name, pokemonName.pokemon_species_id, pokeTypes, pokeStats, getSprites(pokemonName.pokemon_species_id));
            }
            return pokemonData;
        }

        //TODO: move out of service
        public List<Sprite> getSprites(int dexNumber)
        {
            const string urlStart = "https://localhost:7134/images/sprites/pokemon/";
            string urlEnd = dexNumber + ".png";
            string urlEndGif = dexNumber + ".gif";
            const string shiny = "shiny/";
            const string female = "female/";
            const string shinyFemale = "shiny/female/";

            List<Sprite> sprites = new List<Sprite>();
            List<string> spriteKeys = new List<string>
            { 
                "",
                "versions/generation-i/fire-red/", "versions/generation-i/yellow/",
                "versions/generation-ii/gold/", "versions/generation-ii/silver/", "versions/generation-ii/crystal/",
                "versions/generation-iii/ruby-sapphire/", "versions/generation-iii/firered-leafgreen/", "versions/generation-iii/emerald/",
                "versions/generation-iv/diamond-pearl/", "versions/generation-iv/heartgold-soulsilver/", "versions/generation-iv/platinum/",
                "versions/generation-v/black-white/", "versions/generation-v/black-white/animated/",
                "versions/generation-vi/x-y/", "versions/generation-vi/omegaruby-alphasapphire/",
                "versions/generation-vii/ultra-sun-ultra-moon/",
                "versions/generation-viii/icons/",
                "other/showdown/",
                "other/home/",
                "other/official-artwork/",
            };
            List<string> animatedSpriteKeys = new List<string> { "versions/generation-v/black-white/animated/", "other/showdown/" };
            foreach (string key in spriteKeys)
            {
                if (animatedSpriteKeys.Contains(key))
                {
                    sprites.Add(new Sprite(key,
                        urlStart + key + urlEndGif,
                        urlStart + key + shiny + urlEndGif,
                        urlStart + key + female + urlEndGif,
                        urlStart + key + shinyFemale + urlEndGif));
                }
                else
                {
                    sprites.Add(new Sprite(key,
                        urlStart + key + urlEnd,
                        urlStart + key + shiny + urlEnd,
                        urlStart + key + female + urlEnd,
                        urlStart + key + shinyFemale + urlEnd));
                }
            }

            return sprites;
        }


        public async Task<Item?> GetItemByName(string name)
        {
            Item? item = null;
            Item_names? itemNames = await _context.Item_names.FindAsync(name);
            if(itemNames != null)
            {
                Item_prose? itemProse = await _context.Item_prose.FindAsync(itemNames.item_id, 9);
                Items? items = await _context.Items.FindAsync(itemNames.item_id);
                if (itemProse != null && items != null)
                {
                    item = new Item(items.Identifier, itemNames.name, itemProse.effect);
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
                            ChangeChance = meta.stat_chance
                        };
                    }

                    move = new Move
                    {
                        Name = name,

                        PokeType = new PokeType(type.identifier, typeName.name, GetTypeEffectivenessAttack((int)moves.type_id).Result, GetTypeEffectivenessDefense((int)moves.type_id).Result),
                        DamageClass = new MoveDamageClass
                        {
                            Name = damageClass.name,
                            Description = damageClass.description,
                            IconPath = $"https://localhost:7134/images/sprites/misc/damage-class/{damageClass.name}.png"
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
                            Short = effect.short_effect,
                            Long = effect.effect,
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

                        /*
                        Meta = new List<Metadata>
                        {
                            meta.min_hits
                        };
                        */
                    };
                }
            }
            return move;
        }

        public async Task<string?> GetStatNameByIdentifier(string identifier)
        {
            List<Stats?> stats = _context.Stats.Where(s => s.identifier == identifier).ToList();
            if (stats.Count > 0)
            {
                Stat_names? stat_names = await _context.Stat_names.FindAsync(stats[0]?.id, 9); //change for local languague id
                if (stat_names != null)
                {
                    return stat_names.name;
                }
            }
            return null;
        }

        private async Task<PokeType?> GetTypeById(int id)
        {
            PokeType? pokeType = null;
            Types? targetType = await _context.Types.FirstOrDefaultAsync(t => t.id == id);
            if (targetType != null)
            {
                Type_names? targetTypeName = await _context.Type_names.FindAsync(targetType.id, 9);
                if (targetTypeName != null)
                {

                    pokeType = new PokeType(targetType.identifier, targetTypeName.name,
                        GetTypeEffectivenessAttack(targetType.id).Result, GetTypeEffectivenessDefense(targetType.id).Result);
                }
            }
            return pokeType;
        }

        public async Task<PokeType?> GetTypeByIdentifier(string identifier)
        {
            PokeType? pokeType = null;
            Types? targetType = await _context.Types.FirstOrDefaultAsync(t => t.identifier == identifier);

            if (targetType != null)
            {
                Type_names? targetTypeName = await _context.Type_names.FindAsync(targetType.id, 9);
                if (targetTypeName != null)
                {
                    pokeType = new PokeType(targetType.identifier, targetTypeName.name,
                        GetTypeEffectivenessAttack(targetType.id).Result, GetTypeEffectivenessDefense(targetType.id).Result);
                }
            }
            return pokeType;
        }

        public async Task<PokeType?> GetTeraTypeByIdentifier(string identifier)
        {
            PokeType? pokeType = null;
            Types? targetType = await _context.Types.FirstOrDefaultAsync(t => t.identifier == identifier);

            if (targetType != null)
            {
                Type_names? targetTypeName = await _context.Type_names.FindAsync(targetType.id, 9);
                if (targetTypeName != null)
                {
                    pokeType = new PokeType(targetType.identifier, targetTypeName.name,
                        GetTypeEffectivenessAttack(targetType.id).Result, GetTypeEffectivenessDefense(targetType.id).Result, true);
                }
            }
            return pokeType;
        }

        public async Task<List<Tuple<string, int>>?> GetTypeEffectivenessAttack(int id)
        {
            List<Tuple<string, int>> effectivenessAttack = new List<Tuple<string, int>>();
            List<Type_efficacy> typeEfficacyList = _context.Type_efficacy.Where(t => t.damage_type_id == id && t.damage_factor != 100).ToList();
            if (typeEfficacyList != null)
            {
                foreach(var typeEfficacy in typeEfficacyList)
                {
                    Type_names? targetTypeName = await _context.Type_names.FindAsync(typeEfficacy.target_type_id, 9);
                    if (targetTypeName != null)
                    {
                        effectivenessAttack.Add(Tuple.Create(targetTypeName.name, typeEfficacy.damage_factor));
                    }
                }    
            }
            return effectivenessAttack.OrderByDescending(t => t.Item2).ToList();
        }

        public async Task<List<Tuple<string, int>>?> GetTypeEffectivenessDefense(int id)
        {
            List<Tuple<string, int>> effectivenessDefense = new List<Tuple<string, int>>();
            List<Type_efficacy> typeEfficacyList = _context.Type_efficacy.Where(t => t.target_type_id == id && t.damage_factor != 100).ToList();
            if (typeEfficacyList != null)
            {
                foreach (var typeEfficacy in typeEfficacyList)
                {
                    Type_names? targetTypeName = await _context.Type_names.FindAsync(typeEfficacy.damage_type_id, 9);
                    if (targetTypeName != null)
                    {
                        effectivenessDefense.Add(Tuple.Create(targetTypeName.name, typeEfficacy.damage_factor));
                    }
                }
            }
            return effectivenessDefense.OrderByDescending(t => t.Item2).ToList();
        }
    }
}
