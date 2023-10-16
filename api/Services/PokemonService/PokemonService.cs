using api.Data;
using api.Models;
using api.Models.DBModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Numerics;
using System.Xml.Linq;
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
        public Sprites getSprites(int dexNumber)
        {
            string urlStartBase = "https://localhost:7134/images/sprites/pokemon/";
            string urlStartVersions = "https://localhost:7134/images/sprites/pokemon/versions/";
            string urlStartOther = "https://localhost:7134/images/sprites/pokemon/other/";

            string urlEndPng = "/" + dexNumber + ".png";
            string urlEndGif = "/" + dexNumber + ".gif";

            Sprites sprites = new Sprites
            {
                Base = new SpriteStructure("Base", "none", urlStartBase + "" + urlEndPng, urlStartBase + "shiny" + urlEndPng, urlStartBase + "female" + urlEndPng, urlStartBase + "shiny/female" + urlEndPng),
                RedBlue = new SpriteStructure("Red/Blue", "1", urlStartVersions + "generation-i/red-blue" + urlEndPng, urlStartVersions + "generation-i/red-blue/gray" + urlEndPng),
                Yellow = new SpriteStructure("Yellow", "1", urlStartVersions + "generation-i/yellow" + urlEndPng, urlStartVersions + "generation-i/yellow/gray" + urlEndPng),
                Gold = new SpriteStructure("Gold", "2", urlStartVersions + "generation-ii/gold" + urlEndPng, urlStartVersions + "generation-ii/gold/shiny" + urlEndPng),
                Silver = new SpriteStructure("Silver", "2", urlStartVersions + "generation-ii/silver" + urlEndPng, urlStartVersions + "generation-ii/silver/shiny" + urlEndPng),
                Crystal = new SpriteStructure("Crystal", "2", urlStartVersions + "generation-ii/crystal" + urlEndPng, urlStartVersions + "generation-ii/crystal/shiny" + urlEndPng),
                RubySapphire = new SpriteStructure("Ruby/Sapphire", "3", urlStartVersions + "generation-iii/ruby-sapphire" + urlEndPng, urlStartVersions + "generation-iii/ruby-sapphire/shiny" + urlEndPng),
                FireredLeafgreen = new SpriteStructure("Firered/Leafgreen", "3", urlStartVersions + "generation-iii/firered-leafgreen" + urlEndPng, urlStartVersions + "generation-iii/firered-leafgreen/shiny" + urlEndPng),
                Emerald = new SpriteStructure("Emerald", "3", urlStartVersions + "generation-iii/emerald" + urlEndPng, urlStartVersions + "generation-iii/emerald/shiny" + urlEndPng),
                DiamondPearl = new SpriteStructure("Diamond/Pearl", "4", urlStartVersions + "generation-iv/diamond-pearl" + urlEndPng, urlStartVersions + "generation-iv/diamond-pearl/shiny" + urlEndPng, urlStartVersions + "generation-iv/diamond-pearl/female" + urlEndPng, urlStartVersions + "generation-iv/diamond-pearl/shiny/female" + urlEndPng),
                HeartgoldSoulsilver = new SpriteStructure("Heartgold/Soulsilver", "4", urlStartVersions + "generation-iv/heartgold-soulsilver" + urlEndPng, urlStartVersions + "generation-iv/heartgold-soulsilver/shiny" + urlEndPng, urlStartVersions + "generation-iv/heartgold-soulsilver/female" + urlEndPng, urlStartVersions + "generation-iv/heartgold-soulsilver/shiny/female" + urlEndPng),
                Platinum = new SpriteStructure("Platinum", "4", urlStartVersions + "generation-iv/platinum" + urlEndPng, urlStartVersions + "generation-iv/platinum/shiny" + urlEndPng, urlStartVersions + "generation-iv/platinum/female" + urlEndPng, urlStartVersions + "generation-iv/platinum/shiny/female" + urlEndPng),
                BlackWhite = new SpriteStructure("Black/White", "5", urlStartVersions + "generation-v/black-white" + urlEndPng, urlStartVersions + "generation-v/black-white/shiny" + urlEndPng, urlStartVersions + "generation-v/black-white/female" + urlEndPng, urlStartVersions + "generation-v/black-white/shiny/female" + urlEndPng),
                BlackWhiteAnimated = new SpriteStructure("Black/White Animated", "5", urlStartVersions + "generation-v/black-white/animated" + urlEndGif, urlStartVersions + "generation-v/black-white/animated/shiny" + urlEndGif, urlStartVersions + "generation-v/black-white/animated/female" + urlEndGif, urlStartVersions + "generation-v/black-white/animated/shiny/female" + urlEndGif),
                XY = new SpriteStructure("XY", "6", urlStartVersions + "generation-vi/x-y" + urlEndPng, urlStartVersions + "generation-vi/x-y/shiny" + urlEndPng, urlStartVersions + "generation-vi/x-y/female" + urlEndPng, urlStartVersions + "generation-vi/x-y/shiny/female" + urlEndPng),
                OmegarubyAlphasapphire = new SpriteStructure("Omegaruby/Alphasapphire", "6", urlStartVersions + "generation-vi/omegaruby-alphasapphire" + urlEndPng, urlStartVersions + "generation-vi/omegaruby-alphasapphire/shiny" + urlEndPng, urlStartVersions + "generation-vi/omegaruby-alphasapphire/female" + urlEndPng, urlStartVersions + "generation-vi/omegaruby-alphasapphire/shiny/female" + urlEndPng),
                UltraSunUltraMoon = new SpriteStructure("UltraSun/UltraMoon", "7", urlStartVersions + "generation-vii/ultra-sun-ultra-moon" + urlEndPng, urlStartVersions + "generation-vii/ultra-sun-ultra-moon/shiny" + urlEndPng, urlStartVersions + "generation-vii/ultra-sun-ultra-moon/female" + urlEndPng, urlStartVersions + "generation-vii/ultra-sun-ultra-moon/shiny/female" + urlEndPng),
                SwordShield = new SpriteStructure("Sword/Shield", "8", urlStartVersions + "generation-viii/icons" + urlEndPng),
                Showdown = new SpriteStructure("Showdown", "none", urlStartOther + "showdown" + urlEndGif, urlStartOther + "showdown/shiny" + urlEndGif, urlStartOther + "showdown/female" + urlEndGif, urlStartOther + "showdown/shiny/female" + urlEndGif),
                Home = new SpriteStructure("Home", "none", urlStartOther + "home" + urlEndPng, urlStartOther + "home/shiny" + urlEndPng, urlStartOther + "home/female" + urlEndPng, urlStartOther + "home/shiny/female" + urlEndPng),
                OfficialArtwork = new SpriteStructure("Official Artwork", "none", urlStartOther + "official-artwork" + urlEndPng, urlStartOther + "official-artwork/shiny" + urlEndPng)
            };    
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
