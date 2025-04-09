using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBModels;
using static api.DTOs.PokemonDTOs.MoveDTO;
using Microsoft.EntityFrameworkCore;
using api.Util;
using api.Models;

namespace api.Services.PokedexServices
{
    public class MoveService : IMoveService
    {
        private readonly IPokedexContext _pokedexContext;
        private readonly ITypeService _typeService;

        public MoveService(IPokedexContext pokedexContext, ITypeService typeService)
        {
            _pokedexContext = pokedexContext;
            _typeService = typeService;
        }

        public async Task<MoveDTO?> GetMoveByIdentifier(string identifier, int langId)
        {
            MoveDTO? move = null;

            var query =
                from moves in _pokedexContext.moves.Where(m => m.identifier == identifier)

                join moveNames in _pokedexContext.move_names
                on new { Key1 = moves.id, Key2 = langId } equals new { Key1 = moveNames.move_id, Key2 = moveNames.local_language_id } into moveNamesJoin
                from moveNames in moveNamesJoin.DefaultIfEmpty()

                join moveNamesDefault in _pokedexContext.move_names
                on new { Key1 = moves.id, Key2 = (int)Lang.en } equals new { Key1 = moveNamesDefault.move_id, Key2 = moveNamesDefault.local_language_id } into moveNamesDefaultJoin
                from moveNamesDefault in moveNamesDefaultJoin.DefaultIfEmpty()

                select moveNames != null ? moveNames.name : moveNamesDefault.name;

            string? moveName = await query.FirstOrDefaultAsync();

            if (moveName != null)
            {
                move = await GetMoveByName(moveName, langId);
            }

            return move;
        }

        public async Task<MoveDTO?> GetMoveByName(string name, int langId)
        {
            MoveDTO? move = null;

            var query =
                from moveNamesInput in _pokedexContext.move_names.Where(m => m.name == name)

                join moves in _pokedexContext.moves
                on new { Key1 = moveNamesInput.move_id } equals new { Key1 = moves.id } into movesJoin
                from moves in movesJoin.DefaultIfEmpty()

                join moveNames in _pokedexContext.move_names
                on new { Key1 = moves.id, Key2 = langId } equals new { Key1 = moveNames.move_id, Key2 = moveNames.local_language_id } into moveNamesJoin
                from moveNames in moveNamesJoin.DefaultIfEmpty()

                join moveNamesDefault in _pokedexContext.move_names
                on new { Key1 = moves.id, Key2 = (int)Lang.en } equals new { Key1 = moveNamesDefault.move_id, Key2 = moveNamesDefault.local_language_id } into moveNamesDefaultJoin
                from moveNamesDefault in moveNamesDefaultJoin.DefaultIfEmpty()

                join types in _pokedexContext.types
                on new { Key1 = moves.type_id } equals new { Key1 = types.id } into typesJoin
                from types in typesJoin.DefaultIfEmpty()

                join typeNames in _pokedexContext.type_names
                on new { Key1 = moves.type_id, Key2 = langId } equals new { Key1 = typeNames.type_id, Key2 = typeNames.local_language_id } into typeNamesJoin
                from typeNames in typeNamesJoin.DefaultIfEmpty()

                join typeNamesDefault in _pokedexContext.type_names
                on new { Key1 = moves.type_id, Key2 = (int)Lang.en } equals new { Key1 = typeNamesDefault.type_id, Key2 = typeNamesDefault.local_language_id } into typeNamesDefaultJoin
                from typeNamesDefault in typeNamesDefaultJoin.DefaultIfEmpty()

                join damageClass in _pokedexContext.move_damage_class_prose
                on new { Key1 = (int)moves.damage_class_id, Key2 = langId } equals new { Key1 = damageClass.move_damage_class_id, Key2 = damageClass.local_language_id } into damageClassJoin
                from damageClass in damageClassJoin.DefaultIfEmpty()

                join damageClassDefault in _pokedexContext.move_damage_class_prose
                on new { Key1 = (int)moves.damage_class_id, Key2 = (int)Lang.en } equals new { Key1 = damageClassDefault.move_damage_class_id, Key2 = damageClassDefault.local_language_id } into damageClassDefaultJoin
                from damageClassDefault in damageClassDefaultJoin.DefaultIfEmpty()

                join target in _pokedexContext.move_target_prose
                on new { Key1 = (int)moves.target_id, Key2 = langId } equals new { Key1 = target.move_target_id, Key2 = target.local_language_id } into targetJoin
                from target in targetJoin.DefaultIfEmpty()

                join targetDefault in _pokedexContext.move_target_prose
                on new { Key1 = (int)moves.target_id, Key2 = (int)Lang.en } equals new { Key1 = targetDefault.move_target_id, Key2 = targetDefault.local_language_id } into targetDefaultJoin
                from targetDefault in targetDefaultJoin.DefaultIfEmpty()

                join effect in _pokedexContext.move_effect_prose
                on new { Key1 = (int)moves.effect_id, Key2 = langId } equals new { Key1 = effect.move_effect_id, Key2 = effect.local_language_id } into effectJoin
                from effect in effectJoin.DefaultIfEmpty()

                join effectDefault in _pokedexContext.move_effect_prose
                on new { Key1 = (int)moves.effect_id, Key2 = (int)Lang.en } equals new { Key1 = effectDefault.move_effect_id, Key2 = effectDefault.local_language_id } into effectDefaultJoin
                from effectDefault in effectDefaultJoin.DefaultIfEmpty()

                join meta in _pokedexContext.move_meta
                on new { Key1 = moves.type_id } equals new { Key1 = meta.move_id } into metaJoin
                from meta in metaJoin.DefaultIfEmpty()

                join statChanges in _pokedexContext.move_meta_stat_changes
                on new { Key1 = moves.id } equals new { Key1 = statChanges.move_id } into statChangesJoin
                from statChanges in statChangesJoin.DefaultIfEmpty()

                join statNames in _pokedexContext.stat_names
                on new { Key1 = statChanges.stat_id, Key2 = langId } equals new { Key1 = statNames.stat_id, Key2 = statNames.local_language_id } into statNamesJoin
                from statNames in statNamesJoin.DefaultIfEmpty()

                join statNamesDefault in _pokedexContext.stat_names
                on new { Key1 = statChanges.stat_id, Key2 = (int)Lang.en } equals new { Key1 = statNamesDefault.stat_id, Key2 = statNamesDefault.local_language_id } into statNamesDefaultJoin
                from statNamesDefault in statNamesDefaultJoin.DefaultIfEmpty()

                join stats in _pokedexContext.stats
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
                        Description = damageClass != null ? damageClass.description : damageClassDefault.description,
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

            if (move != null && move.PokeType != null)
            {
                types? types = await _pokedexContext.types.FirstOrDefaultAsync(t => t.identifier == move.PokeType.Identifier);
                if (types != null)
                {
                    move.PokeType.EffectivenessAttack = await _typeService.GetTypeEffectivenessAttack(types.id, langId);
                    move.PokeType.EffectivenessDefense = await _typeService.GetTypeEffectivenessDefense(types.id, langId);
                }
            }

            return move;
        }

        public async Task<MovePreviewDTO?> GetMovePreviewByIdentifier(string identifier, int langId)
        {
            MovePreviewDTO? movePreview = null;

            var query =
                from moves in _pokedexContext.moves.Where(m => m.identifier == identifier)

                join moveNames in _pokedexContext.move_names
                on new { Key1 = moves.id, Key2 = langId } equals new { Key1 = moveNames.move_id, Key2 = moveNames.local_language_id } into moveNamesJoin
                from moveNames in moveNamesJoin.DefaultIfEmpty()

                join moveNamesDefault in _pokedexContext.move_names
                on new { Key1 = moves.id, Key2 = (int)Lang.en } equals new { Key1 = moveNamesDefault.move_id, Key2 = moveNamesDefault.local_language_id } into moveNamesDefaultJoin
                from moveNamesDefault in moveNamesDefaultJoin.DefaultIfEmpty()

                join types in _pokedexContext.types
                on new { Key1 = moves.type_id } equals new { Key1 = types.id } into typesJoin
                from types in typesJoin.DefaultIfEmpty()

                join typeNames in _pokedexContext.type_names
                on new { Key1 = types.id, Key2 = langId } equals new { Key1 = typeNames.type_id, Key2 = typeNames.local_language_id } into typeNamesJoin
                from typeNames in typeNamesJoin.DefaultIfEmpty()

                join typeNamesDefault in _pokedexContext.type_names
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

        public async Task<List<QueryResultDTO>> QueryMovesByName(string key, int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            var pathStart = "https://localhost:7134/images/sprites/types/generation-ix/";

            var query =
                from moveNames in _pokedexContext.move_names.Where(i => i.name.ToLower().StartsWith(key.ToLower()) && i.local_language_id == langId)

                join moves in _pokedexContext.moves
                on new { Key1 = moveNames.move_id } equals new { Key1 = moves.id } into movesJoin
                from moves in movesJoin.DefaultIfEmpty()

                join types in _pokedexContext.types
                on new { Key1 = moves.type_id } equals new { Key1 = types.id } into typesJoin
                from types in typesJoin.DefaultIfEmpty()

                select new QueryResultDTO(moveNames.name, moves.identifier, $"{pathStart}{types.identifier}.png", "move");

            queryResults = await query.ToListAsync();

            return queryResults;
        }

    }
}
