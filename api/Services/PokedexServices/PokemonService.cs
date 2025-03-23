using api.Data;
using api.DTOs.PokemonDTOs;
using api.DTOs;
using api.Models.DBModels;
using api.Models.DBPokedexModels;
using api.Models.DBPoketeamModels;
using MethodTimer;
using Microsoft.EntityFrameworkCore;


namespace api.Services.PokedexServices
{
    public class PokemonService : IPokemonService
    {
        private readonly IPokedexContext _pokedexContext;
        private readonly IItemService _itemService;
        private readonly IAbilityService _abilityService;
        private readonly IMoveService _moveService;
        private readonly INatureService _natureService;
        private readonly ITypeService _typeService;

        public PokemonService
            (
                IPokedexContext pokedexContext,
                IItemService itemService,
                IAbilityService abilityService,
                IMoveService moveService,
                INatureService natureService,
                ITypeService typeService
            )
        {
            _pokedexContext = pokedexContext;
            _itemService = itemService;
            _abilityService = abilityService;
            _moveService = moveService;
            _natureService = natureService;
            _typeService = typeService;
        }

        [Time]
        public async Task<PokemonDTO> BuildPokemonDTO(Pokemon pokemon, int langId, TeamOptionsDTO? options = null)
        {
            PokemonDataDTO? pokemonData = await GetPokemonById(pokemon.DexNumber ?? 1, langId);

            List<MoveDTO?> moves = new List<MoveDTO?>
            {
                await _moveService.GetMoveByIdentifier(pokemon.Move1Identifier ?? "", langId),
                await _moveService.GetMoveByIdentifier(pokemon.Move2Identifier ?? "", langId),
                await _moveService.GetMoveByIdentifier(pokemon.Move3Identifier ?? "", langId),
                await _moveService.GetMoveByIdentifier(pokemon.Move4Identifier ?? "", langId)
            };

            PokemonDTO pokemonDTO = new PokemonDTO
            {
                Name = pokemonData.Name,
                Nickname = pokemon.Nickname,
                DexNumber = pokemonData.DexNumber,
                PreEvolution = pokemonData.PreEvolution,
                Evolutions = pokemonData.Evolutions,
                Types = pokemonData.Types,
                TeraType = await _typeService.GetTypeWithEffectivenessByIdentifier(pokemon.TeraTypeIdentifier ?? "", langId, true),
                Item = await _itemService.GetItemByIdentifier(pokemon.ItemIdentifier ?? "", langId),
                Ability = await _abilityService.GetAbilityByIdentifier(pokemon.AbilityIdentifier ?? "", langId),
                Nature = options != null && options.NaturesVisibility ? await _natureService.GetNatureByIdentifier(pokemon.NatureIdentifier ?? "", langId) : null,
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
                && await _abilityService.IsAbilityHidden(pokemonDTO.Ability.Identifier, pokemon.DexNumber ?? 0))
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
                TeraType = await _typeService.GetTypeByIdentifier(pokemon.TeraTypeIdentifier ?? "", true, langId),
                Sprite = new SpriteDTO(pokemon.DexNumber ?? 1),
                Shiny = pokemon.Shiny,
                Gender = pokemon.Gender,
                Moves = moves,
                Item = await _itemService.GetItemByIdentifier(pokemon.ItemIdentifier ?? "", langId),
                AbilityName = _abilityService.GetAbilityByIdentifier(pokemon.AbilityIdentifier ?? "", langId).Result != null ? _abilityService.GetAbilityByIdentifier(pokemon.AbilityIdentifier ?? "", langId).Result.Name : null
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
                await _typeService.GetPokemonTypesWithEffectiveness(id, langId),
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
                    await _typeService.GetPokemonTypes(newID, langId),
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
                            await _typeService.GetPokemonTypes(newID, langId),
                            await GetPokemonStats(newID, langId),
                            new SpriteDTO(newID),
                            evolutions: await GetPokemonEvolutions(newID, langId)));
                    }
                }
            }
            return evolutions;
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
    }
}
