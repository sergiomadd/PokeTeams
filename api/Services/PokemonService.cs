using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBModels;
using api.Models.DBPokedexModels;
using api.Models.DBPoketeamModels;
using api.Services.PokedexServices;
using api.Util;
using Microsoft.EntityFrameworkCore;
using Microsoft.SqlServer.Server;
using System.Security.Cryptography;
using System.Xml.Linq;

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
        private readonly IConfiguration _config;
        private string baseUrl;
        private string pokemonSpriteUrl;

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
                IIdentityService identityService,
                IConfiguration config
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
            _config = config;

            baseUrl = "";
            string? baseUrlTemp = _config["BaseUrl"];
            if (baseUrlTemp != null)
            {
                baseUrl = (string)baseUrlTemp;
            }
            pokemonSpriteUrl = $"{baseUrl}images/pokemon/";
        }

        public async Task<PokemonDTO> BuildPokemonDTO(TeamPokemon pokemon, int langId, TeamOptionsDTO? options = null)
        {
            PokemonDataDTO pokemonData = await GetPokemonDataByPokemonModel(pokemon, langId);

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
                PokemonId = pokemon.PokemonId,
                FormId = pokemon.FormId,
                PreEvolution = pokemonData.PreEvolution,
                Evolutions = pokemonData.Evolutions,
                Forms = pokemonData.Forms,
                Types = pokemonData.Types,
                TeraType = await _typeService.GetTypeWithEffectivenessByIdentifier(pokemon.TeraTypeIdentifier ?? "", langId, true),
                Item = await _itemService.GetItemByIdentifier(pokemon.ItemIdentifier ?? "", langId),
                Ability = await _abilityService.GetAbilityByIdentifier(pokemon.AbilityIdentifier ?? "", langId),
                Nature = options != null && options.NaturesVisibility ? await _natureService.GetNatureByIdentifier(pokemon.NatureIdentifier ?? "", langId) : null,
                Moves = moves,
                Stats = pokemonData.Stats.Count > 0 ? pokemonData.Stats : new List<StatDTO>(),
                ivs = BuildPokemonIVs(pokemon, options),
                evs = BuildPokemonEVs(pokemon, options),
                Level = pokemon.Level,
                Shiny = pokemon.Shiny,
                Gender = pokemon.Gender,
                Sprite = pokemonData.Sprite,
                Notes = pokemon.Notes
            };

            if (pokemonDTO.Ability != null && await _abilityService.IsAbilityPokemonHiddenAbility(pokemonDTO.Ability.Identifier, pokemon.PokemonId))
            {
                pokemonDTO.Ability.Hidden = true;
            }

            return pokemonDTO;
        }

        private List<StatDTO?>? BuildPokemonIVs(TeamPokemon pokemon, TeamOptionsDTO? options)
        {
            List<StatDTO?>? ivs = new List<StatDTO?>();
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

        private List<StatDTO?>? BuildPokemonEVs(TeamPokemon pokemon, TeamOptionsDTO? options)
        {
            List<StatDTO?>? evs = new List<StatDTO?>();
            if (options == null || !options.EvsVisibility)
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

        public async Task<PokemonPreviewDTO> BuildPokemonPreviewDTO(TeamPokemon teamPokemon, int langId)
        {
            List<MovePreviewDTO?> moves = new List<MovePreviewDTO?>()
            {
                await _moveService.GetMovePreviewByIdentifier(teamPokemon.Move1Identifier ?? "", langId),
                await _moveService.GetMovePreviewByIdentifier(teamPokemon.Move2Identifier ?? "", langId),
                await _moveService.GetMovePreviewByIdentifier(teamPokemon.Move3Identifier ?? "", langId),
                await _moveService.GetMovePreviewByIdentifier(teamPokemon.Move4Identifier ?? "", langId)
            };

            return new PokemonPreviewDTO
            {
                Name = await GetPokemonNameByPokemonId(teamPokemon.PokemonId, langId),
                //If pokemon is a form, pokemonId wont be species dex number
                DexNumber = teamPokemon.FormId != null ? await GetPokemonDexNumberByPokemonId(teamPokemon.PokemonId) : teamPokemon.PokemonId,
                TeraType = await _typeService.GetTypeByIdentifier(teamPokemon.TeraTypeIdentifier ?? "", true, langId),
                Sprite = new SpriteDTO(teamPokemon.PokemonId, pokemonSpriteUrl),
                Shiny = teamPokemon.Shiny,
                Gender = teamPokemon.Gender,
                Moves = moves,
                Item = await _itemService.GetItemByIdentifier(teamPokemon.ItemIdentifier ?? "", langId),
                AbilityName = _abilityService.GetAbilityByIdentifier(teamPokemon.AbilityIdentifier ?? "", langId).Result?.Name
            };
        }

        public TeamPokemon BreakPokemonDTO(PokemonDTO pokemonDTO, string teamId)
        {
            return new TeamPokemon
            {
                TeamId = teamId,
                PokemonId = pokemonDTO.PokemonId,
                FormId = pokemonDTO?.FormId,
                Nickname = pokemonDTO?.Nickname,
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

        public async Task<PokemonDTO?> GetPokemonByTeamPokemonId(int teamPokemonId, int langId)
        {
            TeamPokemon? teamPokemon = await _pokeTeamContext.TeamPokemon.Include(p => p.Team).FirstOrDefaultAsync(p => p.TeamPokemonId == teamPokemonId);
            if (teamPokemon != null)
            {
                TeamOptionsDTO teamOptionsDTO = new TeamOptionsDTO(teamPokemon.Team.IVsVisibility, teamPokemon.Team.EVsVisibility, teamPokemon.Team.NaturesVisibility);
                if (teamPokemon.Team.PlayerId != null && teamPokemon.Team.PlayerId == _identityService.GetLoggedUserID())
                {
                    teamOptionsDTO.Logged();
                }
                return await BuildPokemonDTO(teamPokemon, langId, teamOptionsDTO);
            }
            return null;
        }

        public async Task<PokemonDataDTO> GetPokemonDataByPokemonModel(TeamPokemon teamPokemon, int langId)
        {
            PokemonDataDTO pokemonData;
            int dexNumber = teamPokemon.FormId != null ? await GetPokemonDexNumberByPokemonId(teamPokemon.PokemonId) : teamPokemon.PokemonId;
            pokemonData = new PokemonDataDTO(
                await GetPokemonNameByPokemonId(teamPokemon.PokemonId, langId),
                dexNumber,
                teamPokemon.PokemonId,
                await _typeService.GetPokemonTypesWithEffectiveness(teamPokemon.PokemonId, langId),
                await _statService.GetPokemonStats(teamPokemon.PokemonId, langId),
                new SpriteDTO(teamPokemon.PokemonId, pokemonSpriteUrl),
                preEvolution: await GetPokemonPreEvolution(dexNumber, langId),
                evolutions: await GetPokemonEvolutions(dexNumber, langId),
                formId: teamPokemon.FormId,
                forms: await GetPokemonFormsByPokemonId(teamPokemon.PokemonId, langId));
            return pokemonData;
        }

        public async Task<PokemonDataDTO?> GetPokemonDataByPokemonId(int pokemonId, int langId)
        {
            pokemon? pokemon = await _pokedexContext.pokemon.FirstOrDefaultAsync(p => p.id == pokemonId);
            if(pokemon != null)
            {
                int dexNumber = pokemon.species_id;
                return new PokemonDataDTO(
                    await GetPokemonNameByPokemonId(pokemonId, langId),
                    dexNumber,
                    pokemonId,
                    await _typeService.GetPokemonTypesWithEffectiveness(pokemonId, langId),
                    await _statService.GetPokemonStats(pokemonId, langId),
                    new SpriteDTO(pokemonId, pokemonSpriteUrl),
                    preEvolution: await GetPokemonPreEvolution(dexNumber, langId),
                    evolutions: await GetPokemonEvolutions(dexNumber, langId),
                    formId: null,
                    forms: await GetPokemonFormsByPokemonId(pokemonId, langId)
                    );
            }
            return null;
        }

        //Will only be used in paste input parse
        public async Task<PokemonDataDTO?> GetPokemonDataByName(string name, int langId)
        {
            //Case 1: Name is in pokemon_species_names -> ho-ho (not a form)
            pokemon_species_names? pokemon_species_names = await _pokedexContext.pokemon_species_names.FirstOrDefaultAsync(p => p.name.ToLower() == name.ToLower());
            if (pokemon_species_names != null)
            {
                int dexNumber = pokemon_species_names.pokemon_species_id;
                return new PokemonDataDTO(
                    await GetPokemonNameByPokemonId(dexNumber, langId),
                    dexNumber,
                    //PokemonId IS dexNumber becouse its not a form
                    dexNumber,
                    await _typeService.GetPokemonTypesWithEffectiveness(dexNumber, langId),
                    await _statService.GetPokemonStats(dexNumber, langId),
                    new SpriteDTO(dexNumber, pokemonSpriteUrl),
                    preEvolution: await GetPokemonPreEvolution(dexNumber, langId),
                    evolutions: await GetPokemonEvolutions(dexNumber, langId),
                    formId: null,
                    forms: await GetPokemonFormsByPokemonId(dexNumber, langId)
                    );
            }
            
            //Case 2: Name is in pokemon_form_names -> Rapid Strike Urshifu (form)
            pokemon_form_names? pokemon_form_names = await _pokedexContext.pokemon_form_names
                .FirstOrDefaultAsync(p => p.pokemon_name != null && p.pokemon_name.ToLower() == name.ToLower());
            if (pokemon_form_names != null)
            {
                pokemon_forms? pokemon_forms = await _pokedexContext.pokemon_forms.FirstOrDefaultAsync(p => p.id == pokemon_form_names.pokemon_form_id);
                if (pokemon_forms != null)
                {
                    int pokemonId = pokemon_forms.pokemon_id;
                    pokemon? pokemon = await _pokedexContext.pokemon.FirstOrDefaultAsync(p => p.id == pokemonId);
                    if (pokemon != null)
                    {
                        LocalizedText? pokemonName = await GetPokemonNameByPokemonId(pokemonId, langId);
                        return new PokemonDataDTO(
                            pokemonName,
                            pokemon.species_id,
                            pokemonId,
                            await _typeService.GetPokemonTypesWithEffectiveness(pokemon.id, langId),
                            await _statService.GetPokemonStats(pokemon.id, langId),
                            new SpriteDTO(pokemon.id, pokemonSpriteUrl),
                            preEvolution: await GetPokemonPreEvolution(pokemon.species_id, langId),
                            evolutions: await GetPokemonEvolutions(pokemon.species_id, langId),
                            formId: pokemon_forms.id,
                            forms: await GetPokemonFormsByPokemonId(pokemon.id, langId));
                    }
                }
            }

            //Case 3: Name isnt in any names database -> "Urshifu Rapid Strike" OR "Urshifu-Rapid-Strike" (form)
            //Try get the form otherwise
            string formIdentifier = name.ToLower();
            pokemon? pokemon_ = await _pokedexContext.pokemon.FirstOrDefaultAsync(p => p.identifier == formIdentifier);
            if(pokemon_ == null)
            {
                //Turn "Urshifu Rapid Strike" -> "urshifu-rapid-strike"
                formIdentifier = String.Join("-", name.ToLower().Split(" "));
                pokemon_ = await _pokedexContext.pokemon.FirstOrDefaultAsync(p => p.identifier == formIdentifier);
            }
            if (pokemon_ != null)
            {
                int? formId = await GetFormIdByPokemonId(pokemon_.id);
                LocalizedText? pokemonName = await GetPokemonNameByPokemonId(pokemon_.id, langId);
                return new PokemonDataDTO(
                    pokemonName,
                    pokemon_.species_id,
                    pokemon_.id,
                    await _typeService.GetPokemonTypesWithEffectiveness(pokemon_.id, langId),
                    await _statService.GetPokemonStats(pokemon_.id, langId),
                    new SpriteDTO(pokemon_.id, pokemonSpriteUrl),
                    preEvolution: await GetPokemonPreEvolution(pokemon_.species_id, langId),
                    evolutions: await GetPokemonEvolutions(pokemon_.species_id, langId),
                    formId: formId,
                    forms: await GetPokemonFormsByPokemonId(pokemon_.id, langId));
            }

            return null;
        }

        public async Task<PokemonPreviewDTO?> GetPokemonPreviewByTeamPokemonId(int teamPokemonId, int langId)
        {
            TeamPokemon? pokemon = await _pokeTeamContext.TeamPokemon.FirstOrDefaultAsync(t => t.TeamPokemonId == teamPokemonId);
            if (pokemon != null)
            {
                return await BuildPokemonPreviewDTO(pokemon, langId);
            }
            return null;
        }

        public async Task<List<PokemonPreviewDTO>> GetTeamPokemonPreviews(string teamId, int langId)
        {
            List<PokemonPreviewDTO> pokemonPreviewDTOs = new List<PokemonPreviewDTO>();

            Team? team = await _pokeTeamContext.Team.FirstOrDefaultAsync(t => t.Id == teamId);
            if (team != null)
            {
                List<TeamPokemon> pokemons = await _pokeTeamContext.TeamPokemon.Where(p => p.TeamId.Equals(team.Id)).ToListAsync();
                List<int> pokemonIds = pokemons.Select(p => p.TeamPokemonId).ToList();

                foreach (int pokemonId in pokemonIds)
                {
                    PokemonPreviewDTO? pokemonPreviewDTO = await GetPokemonPreviewByTeamPokemonId(pokemonId, langId);
                    if (pokemonPreviewDTO != null)
                    {
                        pokemonPreviewDTOs.Add(pokemonPreviewDTO);
                    }
                }
            }

            return pokemonPreviewDTOs;
        }

        private async Task<LocalizedText?> GetPokemonNameByPokemonId(int pokemonId, int langId)
        {
            LocalizedText? result = null;
            var query =
                from pokemonSpecies in _pokedexContext.pokemon_species.Where(p => p.id == pokemonId)

                join pokemonSpeciesNames in _pokedexContext.pokemon_species_names
                on new { Key1 = pokemonSpecies.id, Key2 = langId } equals new { Key1 = pokemonSpeciesNames.pokemon_species_id, Key2 = pokemonSpeciesNames.local_language_id } into pokemonSpeciesNamesJoin
                from pokemonSpeciesNames in pokemonSpeciesNamesJoin.DefaultIfEmpty()

                join pokemonSpeciesNamesDefault in _pokedexContext.pokemon_species_names
                on new { Key1 = pokemonSpecies.id, Key2 = (int)Lang.en } equals new { Key1 = pokemonSpeciesNamesDefault.pokemon_species_id, Key2 = pokemonSpeciesNamesDefault.local_language_id } into pokemonSpeciesNamesDefaultJoin
                from pokemonSpeciesNamesDefault in pokemonSpeciesNamesDefaultJoin.DefaultIfEmpty()

                select pokemonSpeciesNames != null ?
                    new LocalizedText(pokemonSpeciesNames.name, pokemonSpeciesNames.local_language_id) :
                    new LocalizedText(pokemonSpeciesNamesDefault.name, pokemonSpeciesNamesDefault.local_language_id);

            result = await query.FirstOrDefaultAsync();
            //Try get form name
            if (result == null || IsPokemonDefaultForm(pokemonId))
            {
                query =
                    from pokemonForms in _pokedexContext.pokemon_forms.Where(p => p.pokemon_id == pokemonId)

                    join pokemonFormNames in _pokedexContext.pokemon_form_names
                    on new { Key1 = pokemonForms.id, Key2 = langId } equals new { Key1 = pokemonFormNames.pokemon_form_id, Key2 = pokemonFormNames.local_language_id } into pokemonFormsNamesJoin
                    from pokemonFormNames in pokemonFormsNamesJoin.DefaultIfEmpty()

                    join pokemonFormNamesDefault in _pokedexContext.pokemon_form_names
                    on new { Key1 = pokemonForms.id, Key2 = (int)Lang.en } equals new { Key1 = pokemonFormNamesDefault.pokemon_form_id, Key2 = pokemonFormNamesDefault.local_language_id } into pokemonFormNamesDefaultJoin
                    from pokemonFormNamesDefault in pokemonFormNamesDefaultJoin.DefaultIfEmpty()

                    select pokemonFormNames != null ?
                        new LocalizedText(pokemonFormNames.pokemon_name != null ? pokemonFormNames.pokemon_name : pokemonFormNames.form_name, pokemonFormNames.local_language_id) :
                        new LocalizedText(pokemonFormNamesDefault.pokemon_name != null ? pokemonFormNamesDefault.pokemon_name : pokemonFormNamesDefault.form_name, pokemonFormNamesDefault.local_language_id);
                result = await query.FirstOrDefaultAsync();
            }

            return result;
        }

        private async Task<int?> GetFormIdByPokemonId(int pokemonId)
        {
            int? formId = null;
            pokemon_forms? pokemon_forms = await _pokedexContext.pokemon_forms.FirstOrDefaultAsync(p => p.pokemon_id == pokemonId);
            if (pokemon_forms != null)
            {
                formId = pokemon_forms.id;
            }
            return formId;
        }

        private async Task<EvolutionDTO?> GetPokemonPreEvolution(int dexNumber, int langId)
        {
            pokemon_species? pokemonSpeciesPreEvolution = await _pokedexContext.pokemon_species.FirstOrDefaultAsync(p => p.id == dexNumber);
            if (pokemonSpeciesPreEvolution != null && pokemonSpeciesPreEvolution.evolves_from_species_id != null)
            {
                int preEvolutionDexnumber = pokemonSpeciesPreEvolution.evolves_from_species_id ?? 0;
                return new EvolutionDTO(
                    await GetPokemonNameByPokemonId(preEvolutionDexnumber, langId),
                    preEvolutionDexnumber,
                    preEvolutionDexnumber,
                    await _typeService.GetPokemonTypes(preEvolutionDexnumber, langId),
                    new SpriteDTO(preEvolutionDexnumber, pokemonSpriteUrl),
                    preEvolution: await GetPokemonPreEvolution(preEvolutionDexnumber, langId),
                    forms: await GetPokemonFormsByPokemonId(preEvolutionDexnumber, langId));
            }
            return null;
        }

        private async Task<List<EvolutionDTO?>> GetPokemonEvolutions(int dexNumber, int langId)
        {
            List<EvolutionDTO?> evolutions = new List<EvolutionDTO?>();
            List<pokemon_species> pokemonSpeciesEvolutionList = await _pokedexContext.pokemon_species.Where(p => p.evolves_from_species_id == dexNumber).ToListAsync();
            if (pokemonSpeciesEvolutionList.Count() > 0)
            {
                foreach (pokemon_species pokemonSpeciesEvolution in pokemonSpeciesEvolutionList)
                {
                    if (pokemonSpeciesEvolution != null)
                    {
                        int evolutionDexNumber = pokemonSpeciesEvolution.id;
                        var test = await GetPokemonFormsByPokemonId(evolutionDexNumber, langId);
                        evolutions.Add(new EvolutionDTO(
                            await GetPokemonNameByPokemonId(evolutionDexNumber, langId),
                            evolutionDexNumber,
                            evolutionDexNumber,
                            await _typeService.GetPokemonTypes(evolutionDexNumber, langId),
                            new SpriteDTO(evolutionDexNumber, pokemonSpriteUrl),
                            evolutions: await GetPokemonEvolutions(evolutionDexNumber, langId),
                            forms: await GetPokemonFormsByPokemonId(evolutionDexNumber, langId)));
                    }
                }
            }
            return evolutions;
        }

        //DexNumber = PokemonId in pokemon forms
        private async Task<List<FormDTO?>> GetPokemonFormsByPokemonId(int pokemonId, int langId)
        {
            List<FormDTO?> forms = new List<FormDTO?>();
            if (!ArePokemonFormsExcluded(pokemonId))
            {
                pokemon? pokemonInput = await _pokedexContext.pokemon.FirstOrDefaultAsync(p => p.id == pokemonId);
                if(pokemonInput != null)
                {
                    List<pokemon> pokemonList = await _pokedexContext.pokemon.Where(p => p.species_id == pokemonInput.species_id).ToListAsync();
                    if (pokemonList.Count() > 1)
                    {
                        pokemonList = HandleFormExceptions(pokemonList);
                        //Remove input pokemon, get only other forms
                        pokemonList.RemoveAll(p => p.id == pokemonId);
                        foreach (pokemon pokemon in pokemonList)
                        {
                            if (pokemon != null)
                            {
                                forms.Add(new FormDTO(
                                    await GetPokemonNameByPokemonId(pokemon.id, langId),
                                    pokemon.species_id,
                                    pokemon.id,
                                    await GetFormIdByPokemonId(pokemon.id),
                                    await _typeService.GetPokemonTypes(pokemon.id, langId),
                                    new SpriteDTO(pokemon.id, pokemonSpriteUrl)));
                            }
                        }
                    }
                }
            }
            return forms;
        }

        private async Task<int> GetPokemonDexNumberByPokemonId(int pokemonId)
        {
            pokemon? pokemon = await _pokedexContext.pokemon.FirstOrDefaultAsync(p => p.id == pokemonId);
            if (pokemon != null)
            {
                return pokemon.species_id;
            }
            return pokemonId;
        }

        private List<pokemon> HandleFormExceptions(List<pokemon> pokemonList)
        {
            //If zygarde, non power construct forms (pokemonIds = [718, 10181])
            if (pokemonList.Any(p => p.species_id == 718))
            {
                pokemonList.RemoveAll(p => p.id == 718 || p.id == 10181);
            }
            return pokemonList;
        }
        private bool ArePokemonFormsExcluded(int pokeminId)
        {
            List<int> excludedPokemons = new List<int> { 25 };
            return excludedPokemons.Contains(pokeminId);
        }

        private bool IsPokemonDefaultForm(int pokeminId)
        {
            //[Deoxys, Rotom, Basculin, Oricorio, Lycanroc, Ogerpon, Terapagos]
            List<int> excludedPokemons = new List<int> { 386, 479, 550, 741, 745, 892, 1017, 1024 };
            return excludedPokemons.Contains(pokeminId);
        }

        public async Task<List<QueryResultDTO>> QueryPokemonsByName(string key, int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            var query =
                from pokemonNames in _pokedexContext.pokemon_species_names.Where(p => p.name.ToLower().StartsWith(key.ToLower()) && p.local_language_id == langId)

                join pokemonNamesDefault in _pokedexContext.pokemon_species_names
                on new { Key1 = pokemonNames.pokemon_species_id, Key2 = (int)Lang.en } equals new { Key1 = pokemonNamesDefault.pokemon_species_id, Key2 = pokemonNamesDefault.local_language_id } into pokemonNamesDefaultJoin
                from pokemonNamesDefault in pokemonNamesDefaultJoin.DefaultIfEmpty()

                select pokemonNames != null ? 
                    new QueryResultDTO(pokemonNames.name, pokemonNames.pokemon_species_id.ToString(), $"{pokemonSpriteUrl}{pokemonNames.pokemon_species_id}.png", "pokemon") :
                    new QueryResultDTO(pokemonNamesDefault.name, pokemonNames.pokemon_species_id.ToString(), $"{pokemonSpriteUrl}{pokemonNames.pokemon_species_id}.png", "pokemon");

            var formsQuery =
                from pokemonFormNames in _pokedexContext.pokemon_form_names.Where(p => p.pokemon_name != null && p.pokemon_name.ToLower().Contains(key.ToLower()) && p.local_language_id == langId)

                join pokemonFormNamesDefault in _pokedexContext.pokemon_form_names
                on new { Key1 = pokemonFormNames.pokemon_form_id, Key2 = (int)Lang.en } equals new { Key1 = pokemonFormNamesDefault.pokemon_form_id, Key2 = pokemonFormNamesDefault.local_language_id } into pokemonFormNamesDefaultJoin
                from pokemonFormNamesDefault in pokemonFormNamesDefaultJoin.DefaultIfEmpty()

                join pokemonForms in _pokedexContext.pokemon_forms
                on new { Key1 = pokemonFormNames.pokemon_form_id } equals new { Key1 = pokemonForms.id } into pokemonFormsDefaultJoin
                from pokemonForms in pokemonFormsDefaultJoin.DefaultIfEmpty()

                select pokemonFormNames != null ? 
                    new QueryResultDTO(pokemonFormNames.pokemon_name, pokemonForms.pokemon_id.ToString(), $"{pokemonSpriteUrl}{pokemonForms.pokemon_id}.png", "pokemon") :
                    new QueryResultDTO(pokemonFormNamesDefault.pokemon_name, pokemonForms.pokemon_id.ToString(), $"{pokemonSpriteUrl}{pokemonForms.pokemon_id}.png", "pokemon");

            queryResults = await query.ToListAsync();

            var formsQueryResults = await formsQuery.ToListAsync();

            queryResults = queryResults.Union(formsQueryResults).DistinctBy(p => p.Identifier).ToList();

            return queryResults;
        }
    }
}
