using api.Data;
using api.DTOs.PokemonDTOs;
using api.DTOs;
using api.Models.DBModels;
using api.Models.DBPokedexModels;
using api.Models.DBPoketeamModels;
using MethodTimer;
using Microsoft.EntityFrameworkCore;
using api.Util;
using System.Text.Json;
using api.Services.PokedexServices;

namespace api.Services
{
    public class PokemonService : IPokemonService
    {
        private readonly IPokedexContext _pokedexContext;
        private readonly PokeTeamContext _pokeTeamContext;
        private readonly IItemService _itemService;
        private readonly IAbilityService _abilityService;
        private readonly IMoveService _moveService;
        private readonly INatureService _natureService;
        private readonly ITypeService _typeService;
        private readonly IStatService _statService;
        private readonly IIdentityService _identityService;

        private readonly string pokemonSpriteUrl = "https://localhost:7134/images/sprites/pokemon/";

        public PokemonService
            (
                IPokedexContext pokedexContext,
                PokeTeamContext pokeTeamContext,
                IItemService itemService,
                IAbilityService abilityService,
                IMoveService moveService,
                INatureService natureService,
                ITypeService typeService,
                IStatService statService,
                IIdentityService identityService
            )
        {
            _pokedexContext = pokedexContext;
            _pokeTeamContext = pokeTeamContext;
            _itemService = itemService;
            _abilityService = abilityService;
            _moveService = moveService;
            _natureService = natureService;
            _typeService = typeService;
            _statService = statService;
            _identityService = identityService;
        }

        public async Task<PokemonDTO> BuildPokemonDTO(Pokemon pokemon, int langId, TeamOptionsDTO? options = null)
        {
            PokemonDataDTO? pokemonData = await GetPokemonDataById(pokemon.DexNumber ?? 1, langId);

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

            if (pokemonDTO.Ability != null && pokemonDTO.DexNumber != null && await _abilityService.IsAbilityPokemonHiddenAbility(pokemonDTO.Ability.Identifier, pokemon.DexNumber ?? 0))
            {
                pokemonDTO.Ability.Hidden = true;
            }

            return pokemonDTO;
        }

        private List<StatDTO?>? BuildPokemonIVs(Pokemon pokemon, TeamOptionsDTO? options)
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

        private List<StatDTO?>? BuildPokemonEVs(Pokemon pokemon, TeamOptionsDTO? options)
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
                await _moveService.GetMovePreviewByIdentifier(pokemon.Move1Identifier ?? "", langId),
                await _moveService.GetMovePreviewByIdentifier(pokemon.Move2Identifier ?? "", langId),
                await _moveService.GetMovePreviewByIdentifier(pokemon.Move3Identifier ?? "", langId),
                await _moveService.GetMovePreviewByIdentifier(pokemon.Move4Identifier ?? "", langId)
            };

            return new PokemonPreviewDTO
            {
                Name = await GetPokemonName(pokemon.DexNumber ?? 1, langId),
                DexNumber = pokemon.DexNumber,
                TeraType = await _typeService.GetTypeByIdentifier(pokemon.TeraTypeIdentifier ?? "", true, langId),
                Sprite = new SpriteDTO(pokemon.DexNumber ?? 1, pokemonSpriteUrl),
                Shiny = pokemon.Shiny,
                Gender = pokemon.Gender,
                Moves = moves,
                Item = await _itemService.GetItemByIdentifier(pokemon.ItemIdentifier ?? "", langId),
                AbilityName = _abilityService.GetAbilityByIdentifier(pokemon.AbilityIdentifier ?? "", langId).Result != null ? _abilityService.GetAbilityByIdentifier(pokemon.AbilityIdentifier ?? "", langId).Result.Name : null
            };
        }

        public Pokemon BreakPokemonDTO(PokemonDTO? pokemonDTO, string teamId)
        {
            return new Pokemon
            {
                TeamId = teamId,
                DexNumber = pokemonDTO?.DexNumber,
                Nickname = pokemonDTO?.Nickname,
                Type1Identifier = pokemonDTO?.Types?.Type1?.Identifier,
                Type2Identifier = pokemonDTO?.Types?.Type2?.Identifier,
                TeraTypeIdentifier = pokemonDTO?.TeraType?.Identifier,
                ItemIdentifier = pokemonDTO?.Item?.Identifier,
                AbilityIdentifier = pokemonDTO?.Ability?.Identifier,
                NatureIdentifier = pokemonDTO?.Nature?.Identifier,
                Move1Identifier = pokemonDTO?.Moves?[0]?.Identifier,
                Move2Identifier = pokemonDTO?.Moves?[1]?.Identifier,
                Move3Identifier = pokemonDTO?.Moves?[2]?.Identifier,
                Move4Identifier = pokemonDTO?.Moves?[3]?.Identifier,
                Level = pokemonDTO?.Level,
                Shiny = pokemonDTO?.Shiny,
                Gender = pokemonDTO?.Gender,
                Notes = pokemonDTO?.Notes,
                IV_hp = pokemonDTO?.ivs?[0]?.Value,
                IV_atk = pokemonDTO?.ivs?[1]?.Value,
                IV_def = pokemonDTO?.ivs?[2]?.Value,
                IV_spa = pokemonDTO?.ivs?[3]?.Value,
                IV_spd = pokemonDTO?.ivs?[4]?.Value,
                IV_spe = pokemonDTO?.ivs?[5]?.Value,
                EV_hp = pokemonDTO?.evs?[0]?.Value,
                EV_atk = pokemonDTO?.evs?[1]?.Value,
                EV_def = pokemonDTO?.evs?[2]?.Value,
                EV_spa = pokemonDTO?.evs?[3]?.Value,
                EV_spd = pokemonDTO?.evs?[4]?.Value,
                EV_spe = pokemonDTO?.evs?[5]?.Value
            };
        }

        public async Task<PokemonDTO?> GetPokemonById(int id, int langId)
        {
            Pokemon? pokemon = _pokeTeamContext.Pokemon.Include(p => p.Team).FirstOrDefault(p => p.Id == id);
            if (pokemon != null)
            {
                TeamOptionsDTO teamOptionsDTO = new TeamOptionsDTO(pokemon.Team.IVsVisibility, pokemon.Team.EVsVisibility, pokemon.Team.NaturesVisibility);
                if (pokemon.Team.PlayerId != null && pokemon.Team.PlayerId == _identityService.GetLoggedUserID())
                {
                    teamOptionsDTO.Logged();
                }
                return await BuildPokemonDTO(pokemon, langId, teamOptionsDTO);
            }
            return null;
        }

        public async Task<PokemonDataDTO?> GetPokemonDataById(int id, int langId)
        {
            PokemonDataDTO pokemonData = new PokemonDataDTO(
                await GetPokemonName(id, langId),
                id,
                await _typeService.GetPokemonTypesWithEffectiveness(id, langId),
                await _statService.GetPokemonStats(id, langId),
                new SpriteDTO(id, pokemonSpriteUrl),
                preEvolution: await GetPokemonPreEvolution(id, langId),
                evolutions: await GetPokemonEvolutions(id, langId));
            return pokemonData;
        }

        public async Task<PokemonDataDTO?> GetPokemonDataByName(string name, int langId)
        {
            pokemon_species_names? pokemonName = await _pokedexContext.pokemon_species_names.FirstOrDefaultAsync(p => p.name == name);
            if (pokemonName != null)
            {
                return await GetPokemonDataById(pokemonName.pokemon_species_id, langId);
            }
            return null;
        }

        public async Task<PokemonPreviewDTO?> GetPokemonPreviewById(int id, int langId)
        {
            Pokemon? pokemon = _pokeTeamContext.Pokemon.FirstOrDefault(t => t.Id == id);
            if (pokemon != null)
            {
                return await BuildPokemonPreviewDTO(pokemon, langId);
            }
            return null;
        }

        public async Task<List<PokemonPreviewDTO>> GetTeamPokemonPreviews(string id, int langId)
        {
            List<PokemonPreviewDTO> pokemonPreviewDTOs = new List<PokemonPreviewDTO>();

            Team team = _pokeTeamContext.Team.FirstOrDefault(t => t.Id == id);
            if (team != null)
            {
                List<Pokemon> pokemons = _pokeTeamContext.Pokemon.Where(p => p.TeamId.Equals(team.Id)).ToList();
                List<int> pokemonIds = pokemons.Select(p => p.Id).ToList();

                foreach (int pokemonId in pokemonIds)
                {
                    PokemonPreviewDTO pokemonPreviewDTO = await GetPokemonPreviewById(pokemonId, langId);
                    if (pokemonPreviewDTO != null)
                    {
                        pokemonPreviewDTOs.Add(pokemonPreviewDTO);
                    }
                }
            }

            return pokemonPreviewDTOs;
        }

        private async Task<LocalizedText?> GetPokemonName(int id, int langId)
        {
            var query =
                from pokemonSpecies in _pokedexContext.pokemon_species.Where(p => p.id == id)

                join pokemonSpeciesNames in _pokedexContext.pokemon_species_names
                on new { Key1 = pokemonSpecies.id, Key2 = langId } equals new { Key1 = pokemonSpeciesNames.pokemon_species_id, Key2 = pokemonSpeciesNames.local_language_id } into pokemonSpeciesNamesJoin
                from pokemonSpeciesNames in pokemonSpeciesNamesJoin.DefaultIfEmpty()

                join pokemonSpeciesNamesDefault in _pokedexContext.pokemon_species_names
                on new { Key1 = pokemonSpecies.id, Key2 = (int)Lang.en } equals new { Key1 = pokemonSpeciesNamesDefault.pokemon_species_id, Key2 = pokemonSpeciesNamesDefault.local_language_id } into pokemonSpeciesNamesDefaultJoin
                from pokemonSpeciesNamesDefault in pokemonSpeciesNamesDefaultJoin.DefaultIfEmpty()

                select pokemonSpeciesNames != null ?
                    new LocalizedText(pokemonSpeciesNames.name, pokemonSpeciesNames.local_language_id) :
                    new LocalizedText(pokemonSpeciesNamesDefault.name, pokemonSpeciesNamesDefault.local_language_id);

            return await query.FirstOrDefaultAsync();
        }



        private async Task<EvolutionDTO?> GetPokemonPreEvolution(int id, int langId)
        {
            pokemon_species? pokemonSpeciesPreEvolution = await _pokedexContext.pokemon_species.FirstOrDefaultAsync(p => p.id == id);
            if (pokemonSpeciesPreEvolution != null && pokemonSpeciesPreEvolution.evolves_from_species_id != null)
            {
                int newID = pokemonSpeciesPreEvolution.evolves_from_species_id ?? 0;
                return new EvolutionDTO(
                    await GetPokemonName(newID, langId),
                    newID,
                    await _typeService.GetPokemonTypes(newID, langId),
                    await _statService.GetPokemonStats(newID, langId),
                    new SpriteDTO(newID, pokemonSpriteUrl),
                    preEvolution: await GetPokemonPreEvolution(newID, langId));
            }
            return null;
        }

        private async Task<List<EvolutionDTO?>> GetPokemonEvolutions(int id, int langId)
        {
            List<EvolutionDTO?> evolutions = new List<EvolutionDTO?>();
            List<pokemon_species> pokemonSpeciesEvolutionList = await _pokedexContext.pokemon_species.Where(p => p.evolves_from_species_id == id).ToListAsync();
            if (pokemonSpeciesEvolutionList.Count() > 0)
            {
                foreach (pokemon_species pokemonSpeciesEvolution in pokemonSpeciesEvolutionList)
                {
                    if (pokemonSpeciesEvolution != null)
                    {
                        int newID = pokemonSpeciesEvolution.id;
                        evolutions.Add(new EvolutionDTO(
                            await GetPokemonName(newID, langId), newID,
                            await _typeService.GetPokemonTypes(newID, langId),
                            await _statService.GetPokemonStats(newID, langId),
                            new SpriteDTO(newID, pokemonSpriteUrl),
                            evolutions: await GetPokemonEvolutions(newID, langId)));
                    }
                }
            }
            return evolutions;
        }

        public async Task<List<QueryResultDTO>> QueryPokemonsByName(string key, int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            var query =
                from pokemonNames in _pokedexContext.pokemon_species_names.Where(p => p.name.ToLower().StartsWith(key.ToLower()) && p.local_language_id == langId)

                join pokemonNamesDefault in _pokedexContext.pokemon_species_names
                on new { Key1 = pokemonNames.pokemon_species_id, Key2 = (int)Lang.en } equals new { Key1 = pokemonNamesDefault.pokemon_species_id, Key2 = pokemonNamesDefault.local_language_id } into pokemonNamesDefaultJoin
                from pokemonNamesDefault in pokemonNamesDefaultJoin.DefaultIfEmpty()

                select pokemonNames != null ? new QueryResultDTO(pokemonNames.name, pokemonNames.pokemon_species_id.ToString(), $"{pokemonSpriteUrl}{pokemonNames.pokemon_species_id}.png", "pokemon") :
                    new QueryResultDTO(pokemonNamesDefault.name, pokemonNames.pokemon_species_id.ToString(), $"{pokemonSpriteUrl}{pokemonNames.pokemon_species_id}.png", "pokemon");

            queryResults = await query.ToListAsync();

            return queryResults;
        }
    }
}
