using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBModels;
using static api.DTOs.PokemonDTOs.MoveDTO;
using Microsoft.EntityFrameworkCore;
using api.Util;
using Microsoft.Extensions.Caching.Memory;

namespace api.Services.PokedexServices
{
    public class MoveService : IMoveService
    {
        private readonly IPokedexContext _pokedexContext;
        private readonly ITypeService _typeService;
        private readonly IConfiguration _config;
        private readonly IMemoryCache _cache;
        private string baseUrl;
        private string pokeTypeIconPath;
        private string damageClassIconPath;

        public MoveService(IPokedexContext pokedexContext, ITypeService typeService, IConfiguration config, IMemoryCache cache)
        {
            _pokedexContext = pokedexContext;
            _typeService = typeService;
            _config = config;
            _cache = cache;

            baseUrl = "";
            string? baseUrlTemp = _config["BaseUrl"];
            if (baseUrlTemp != null)
            {
                baseUrl = (string)baseUrlTemp;
            }
            pokeTypeIconPath = $"{baseUrl}images/types/";
            damageClassIconPath = $"{baseUrl}images/damage-class/";
        }

        public async Task<MoveDTO?> GetMoveByIdentifier(string identifier, int langId)
        {
            return await PokedexCache.GetOrCreateAsync(_cache, "move", identifier, langId, async () => await FetchMoveByIdentifier(identifier, langId));
        }

        private async Task<MoveDTO?> FetchMoveByIdentifier(string identifier, int langId)
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

        public async Task<Dictionary<string, MoveDTO>> GetMovesByIdentifiers(List<string> identifiers, int langId)
        {
            if (identifiers == null || identifiers.Count == 0)
            {
                return new Dictionary<string, MoveDTO>();
            }

            return await PokedexCache.GetOrCreateManyAsync<MoveDTO>(_cache, "move", identifiers, langId, async missing => await FetchMovesByIdentifiers(missing, langId));
        }

        private async Task<Dictionary<string, MoveDTO>> FetchMovesByIdentifiers(List<string> identifiers, int langId)
        {
            Dictionary<string, MoveDTO> movesByIdentifier = new Dictionary<string, MoveDTO>();

            var query =
                from moves in _pokedexContext.moves.Where(m => identifiers.Contains(m.identifier))

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
                    Name = moveNames != null ? new LocalizedText(moveNames.name, moveNames.local_language_id, moveNamesDefault.name) : new LocalizedText(moveNamesDefault.name, moveNamesDefault.local_language_id, moveNamesDefault.name),
                    PokeType = new PokeTypeWithEffectivenessDTO(
                        types.identifier,
                        new LocalizedText(typeNames.name, typeNames.local_language_id, null),
                        $"{pokeTypeIconPath}{types.identifier}.png",
                        null,
                        null,
                        false),
                    DamageClass = new MoveDamageClass
                    {
                        Name = Formatter.CapitalizeFirst(damageClass != null ? damageClass.name : damageClassDefault.name),
                        Description = damageClass != null ? damageClass.description : damageClassDefault.description,
                        IconPath = $"{damageClassIconPath}{damageClass.move_damage_class_id}.png"
                    },
                    Power = moves.power,
                    Pp = moves.pp,
                    Accuracy = moves.accuracy,
                    Priority = moves.priority,
                    Target = new MoveTarget
                    {
                        Name = target != null ? target.name : targetDefault.name,
                        Description = target != null ? new LocalizedText(Formatter.FormatProse(target.description, baseUrl, null), target.local_language_id, null) :
                            new LocalizedText(Formatter.FormatProse(targetDefault.description, baseUrl, null), targetDefault.local_language_id, null)
                    },
                    Effect = new MoveEffect
                    {
                        Short = effect != null ? new LocalizedText(Formatter.FormatProse(effect.short_effect, baseUrl, new string?[] { moves.effect_chance.ToString() }), effect.local_language_id, null) :
                            new LocalizedText(Formatter.FormatProse(effectDefault.short_effect, baseUrl, new string?[] { moves.effect_chance.ToString() }), effectDefault.local_language_id, null),
                        Long = effect != null ? new LocalizedText(Formatter.FormatProse(effect.effect, baseUrl, new string?[] { moves.effect_chance.ToString() }), effect.local_language_id, null) :
                            new LocalizedText(Formatter.FormatProse(effectDefault.effect, baseUrl, new string?[] { moves.effect_chance.ToString() }), effectDefault.local_language_id, null),
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
                                statNames != null ? new (statNames.name, statNames.local_language_id, null) : new LocalizedText(statNamesDefault.name, statNamesDefault.local_language_id, null),
                                null),
                            Change = statChanges.change,
                            ChangeChance = meta.stat_chance
                        }
                    }
                };

            List<MoveDTO> movesList = await query.ToListAsync();

            //One-to-many joins (e.g. stat changes) can yield multiple rows per move; keep the first to match GetMoveByName's single-row semantics
            foreach (IGrouping<string, MoveDTO> movesForIdentifier in movesList.GroupBy(m => m.Identifier))
            {
                MoveDTO move = movesForIdentifier.First();
                if (move.PokeType != null)
                {
                    types? movePokeType = await _pokedexContext.types.FirstOrDefaultAsync(t => t.identifier == move.PokeType.Identifier);
                    if (movePokeType != null)
                    {
                        move.PokeType.EffectivenessAttack = await _typeService.GetTypeEffectivenessAttack(movePokeType.id, langId);
                        move.PokeType.EffectivenessDefense = await _typeService.GetTypeEffectivenessDefense(movePokeType.id, langId);
                    }
                }
                movesByIdentifier[move.Identifier] = move;
            }

            return movesByIdentifier;
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
                    Name = moveNames != null ? new LocalizedText(moveNames.name, moveNames.local_language_id, moveNamesDefault.name) : new LocalizedText(moveNamesDefault.name, moveNamesDefault.local_language_id, moveNamesDefault.name),
                    PokeType = new PokeTypeWithEffectivenessDTO(
                        types.identifier,
                        new LocalizedText(typeNames.name, typeNames.local_language_id, null),
                        $"{pokeTypeIconPath}{types.identifier}.png",
                        null,
                        null,
                        false),
                    DamageClass = new MoveDamageClass
                    {
                        Name = Formatter.CapitalizeFirst(damageClass != null ? damageClass.name : damageClassDefault.name),
                        Description = damageClass != null ? damageClass.description : damageClassDefault.description,
                        IconPath = $"{damageClassIconPath}{damageClass.move_damage_class_id}.png"
                    },
                    Power = moves.power,
                    Pp = moves.pp,
                    Accuracy = moves.accuracy,
                    Priority = moves.priority,
                    Target = new MoveTarget
                    {
                        Name = target != null ? target.name : targetDefault.name,
                        Description = target != null ? new LocalizedText(Formatter.FormatProse(target.description, baseUrl, null), target.local_language_id, null) :
                            new LocalizedText(Formatter.FormatProse(targetDefault.description, baseUrl, null), targetDefault.local_language_id, null)
                    },
                    Effect = new MoveEffect
                    {
                        Short = effect != null ? new LocalizedText(Formatter.FormatProse(effect.short_effect, baseUrl, new string?[] { moves.effect_chance.ToString() }), effect.local_language_id, null) :
                            new LocalizedText(Formatter.FormatProse(effectDefault.short_effect, baseUrl, new string?[] { moves.effect_chance.ToString() }), effectDefault.local_language_id, null),
                        Long = effect != null ? new LocalizedText(Formatter.FormatProse(effect.effect, baseUrl, new string?[] { moves.effect_chance.ToString() }), effect.local_language_id, null) :
                            new LocalizedText(Formatter.FormatProse(effectDefault.effect, baseUrl, new string?[] { moves.effect_chance.ToString() }), effectDefault.local_language_id, null),
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
                                statNames != null ? new (statNames.name, statNames.local_language_id, null) : new LocalizedText(statNamesDefault.name, statNamesDefault.local_language_id, null),
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
            return await PokedexCache.GetOrCreateAsync(_cache, "move-preview", identifier, langId, async () => await FetchMovePreviewByIdentifier(identifier, langId));
        }

        private async Task<MovePreviewDTO?> FetchMovePreviewByIdentifier(string identifier, int langId)
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
                    moveNames != null ? new LocalizedText(moveNames.name, moveNames.local_language_id, moveNamesDefault.name) : new LocalizedText(moveNamesDefault.name, moveNamesDefault.local_language_id, moveNamesDefault.name),
                    new PokeTypeDTO(
                        types.identifier,
                        typeNames != null ?
                            new LocalizedText(typeNames.name, typeNames.local_language_id, null) :
                            new LocalizedText(typeNamesDefault.name, typeNames.local_language_id, null),
                        $"{pokeTypeIconPath}{types.identifier}.png",
                        false));

            movePreview = await query.FirstOrDefaultAsync();

            return movePreview;
        }

        public async Task<Dictionary<string, MovePreviewDTO>> GetMovePreviewsByIdentifiers(List<string> identifiers, int langId)
        {
            if (identifiers == null || identifiers.Count == 0)
            {
                return new Dictionary<string, MovePreviewDTO>();
            }

            return await PokedexCache.GetOrCreateManyAsync<MovePreviewDTO>(_cache, "move-preview", identifiers, langId, async missing => await FetchMovePreviewsByIdentifiers(missing, langId));
        }

        private async Task<Dictionary<string, MovePreviewDTO>> FetchMovePreviewsByIdentifiers(List<string> identifiers, int langId)
        {
            Dictionary<string, MovePreviewDTO> movePreviewsByIdentifier = new Dictionary<string, MovePreviewDTO>();

            var query =
                from moves in _pokedexContext.moves.Where(m => identifiers.Contains(m.identifier))

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
                    moveNames != null ? new LocalizedText(moveNames.name, moveNames.local_language_id, moveNamesDefault.name) : new LocalizedText(moveNamesDefault.name, moveNamesDefault.local_language_id, moveNamesDefault.name),
                    new PokeTypeDTO(
                        types.identifier,
                        typeNames != null ?
                            new LocalizedText(typeNames.name, typeNames.local_language_id, null) :
                            new LocalizedText(typeNamesDefault.name, typeNames.local_language_id, null),
                        $"{pokeTypeIconPath}{types.identifier}.png",
                        false));

            List<MovePreviewDTO> movePreviewsList = await query.ToListAsync();

            //Same identifier could join to multiple type_names rows across languages if data is inconsistent; keep the first to match GetMovePreviewByIdentifier's single-row semantics
            foreach (IGrouping<string, MovePreviewDTO> previewsForIdentifier in movePreviewsList.GroupBy(m => m.Identifier))
            {
                movePreviewsByIdentifier[previewsForIdentifier.Key] = previewsForIdentifier.First();
            }

            return movePreviewsByIdentifier;
        }

        public async Task<List<QueryResultDTO>> QueryMovesByName(string key, int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            var query =
                from moveNames in _pokedexContext.move_names.Where(i => i.name.ToLower().StartsWith(key.ToLower()) && i.local_language_id == langId)

                join moves in _pokedexContext.moves
                on new { Key1 = moveNames.move_id } equals new { Key1 = moves.id } into movesJoin
                from moves in movesJoin.DefaultIfEmpty()

                join types in _pokedexContext.types
                on new { Key1 = moves.type_id } equals new { Key1 = types.id } into typesJoin
                from types in typesJoin.DefaultIfEmpty()

                select new QueryResultDTO(moveNames.name, moves.identifier, $"{pokeTypeIconPath}{types.identifier}.png", "move");

            queryResults = await query.ToListAsync();

            return queryResults;
        }

    }
}
