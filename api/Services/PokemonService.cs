﻿using api.Data;
using api.DTOs.PokemonDTOs;
using api.DTOs;
using api.Models.DBModels;
using api.Models.DBPokedexModels;
using api.Models.DBPoketeamModels;
using Microsoft.EntityFrameworkCore;
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

        public async Task<PokemonDTO> BuildPokemonDTO(Pokemon pokemon, int langId, TeamOptionsDTO? options = null)
        {
            PokemonDataDTO? pokemonData = await GetPokemonData(pokemon, langId);

            List<MoveDTO?> moves = new List<MoveDTO?>
            {
                await _moveService.GetMoveByIdentifier(pokemon.Move1Identifier ?? "", langId),
                await _moveService.GetMoveByIdentifier(pokemon.Move2Identifier ?? "", langId),
                await _moveService.GetMoveByIdentifier(pokemon.Move3Identifier ?? "", langId),
                await _moveService.GetMoveByIdentifier(pokemon.Move4Identifier ?? "", langId)
            };

            PokemonDTO pokemonDTO = new PokemonDTO
            {
                Name = pokemonData?.Name,
                Nickname = pokemon.Nickname,
                DexNumber = pokemonData?.DexNumber,
                PreEvolution = pokemonData?.PreEvolution,
                Evolutions = pokemonData?.Evolutions,
                Forms = pokemonData?.Forms,
                Types = pokemonData?.Types,
                TeraType = await _typeService.GetTypeWithEffectivenessByIdentifier(pokemon.TeraTypeIdentifier ?? "", langId, true),
                Item = await _itemService.GetItemByIdentifier(pokemon.ItemIdentifier ?? "", langId),
                Ability = await _abilityService.GetAbilityByIdentifier(pokemon.AbilityIdentifier ?? "", langId),
                Nature = options != null && options.NaturesVisibility ? await _natureService.GetNatureByIdentifier(pokemon.NatureIdentifier ?? "", langId) : null,
                Moves = moves,
                Stats = pokemonData != null ? pokemonData.Stats : new List<StatDTO>(),
                ivs = BuildPokemonIVs(pokemon, options),
                evs = BuildPokemonEVs(pokemon, options),
                Level = pokemon.Level,
                Shiny = pokemon.Shiny,
                Gender = pokemon.Gender,
                Sprite = pokemonData?.Sprite,
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

        private List<StatDTO?>? BuildPokemonEVs(Pokemon pokemon, TeamOptionsDTO? options)
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

        public async Task<PokemonPreviewDTO> BuildPokemonPreviewDTO(Pokemon pokemon, int langId)
        {
            List<MovePreviewDTO?> moves = new List<MovePreviewDTO?>()
            {
                await _moveService.GetMovePreviewByIdentifier(pokemon.Move1Identifier ?? "", langId),
                await _moveService.GetMovePreviewByIdentifier(pokemon.Move2Identifier ?? "", langId),
                await _moveService.GetMovePreviewByIdentifier(pokemon.Move3Identifier ?? "", langId),
                await _moveService.GetMovePreviewByIdentifier(pokemon.Move4Identifier ?? "", langId)
            };

            if (pokemon.FormId != null && pokemon.DexNumber != null && !ArePokemonFormsExcluded((int)pokemon.DexNumber))
            {
                int? id = await GetPokemonIdByFormId(pokemon.FormId);
                return new PokemonPreviewDTO
                {
                    Name = await GetPokemonFormNameByFormId(pokemon.FormId ?? 1, langId),
                    DexNumber = pokemon.DexNumber,
                    TeraType = await _typeService.GetTypeByIdentifier(pokemon.TeraTypeIdentifier ?? "", true, langId),
                    Sprite = new SpriteDTO(id ?? 1, pokemonSpriteUrl),
                    Shiny = pokemon.Shiny,
                    Gender = pokemon.Gender,
                    Moves = moves,
                    Item = await _itemService.GetItemByIdentifier(pokemon.ItemIdentifier ?? "", langId),
                    AbilityName = _abilityService.GetAbilityByIdentifier(pokemon.AbilityIdentifier ?? "", langId).Result?.Name
                };
            }
            else
            {
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
                    AbilityName = _abilityService.GetAbilityByIdentifier(pokemon.AbilityIdentifier ?? "", langId).Result?.Name
                };
            }
        }

        public Pokemon BreakPokemonDTO(PokemonDTO pokemonDTO, string teamId)
        {
            return new Pokemon
            {
                TeamId = teamId,
                DexNumber = pokemonDTO?.DexNumber,
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

        public async Task<PokemonDTO?> GetPokemonById(int id, int langId)
        {
            Pokemon? pokemon = await _pokeTeamContext.Pokemon.Include(p => p.Team).FirstOrDefaultAsync(p => p.Id == id);
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

        public async Task<PokemonDataDTO> GetPokemonData(Pokemon pokemon, int langId)
        {
            PokemonDataDTO pokemonData;
            int dexNumber = 0;
            int id = 0;
            List<FormDTO?>? forms = null;

            if (pokemon.DexNumber != null)
            {
                dexNumber = (int)pokemon.DexNumber;
                id = dexNumber;
            }

            LocalizedText? name = await GetPokemonName(dexNumber, langId);

            if (pokemon.FormId != null && pokemon.DexNumber != null && !ArePokemonFormsExcluded((int)pokemon.DexNumber))
            {
                pokemon_forms? pokemon_forms = await _pokedexContext.pokemon_forms.FirstOrDefaultAsync(p => p.id == pokemon.FormId);
                if(pokemon_forms != null)
                {
                    id = pokemon_forms.pokemon_id;
                }
                forms = await GetPokemonForms((int)pokemon.FormId, langId);
                forms.RemoveAll(f => f != null && f.DexNumber == pokemon.FormId);
                name = await GetPokemonFormNameByFormId((int)pokemon.FormId, langId);
            }

            pokemonData = new PokemonDataDTO(
                name,
                dexNumber,
                await _typeService.GetPokemonTypesWithEffectiveness(id, langId),
                await _statService.GetPokemonStats(id, langId),
                new SpriteDTO(id, pokemonSpriteUrl),
                preEvolution: await GetPokemonPreEvolution(dexNumber, langId),
                evolutions: await GetPokemonEvolutions(dexNumber, langId),
                formId: pokemon.FormId,
                forms: forms);
            return pokemonData;
        }

        public async Task<PokemonDataDTO?> GetPokemonDataByDexNumber(int dexNumber, int langId)
        {
            int? speciesDexNumber = null;
            List<FormDTO?>? forms = null;
            int? formId = null;
            pokemon_forms? pokemon_forms = await _pokedexContext.pokemon_forms.FirstOrDefaultAsync(p => p.pokemon_id == dexNumber);
            if(pokemon_forms != null)
            {
                LocalizedText? pokemonName = null;
                if (pokemon_forms.form_identifier == null)
                {
                    pokemonName = await GetPokemonName(pokemon_forms.id, langId);
                }
                else
                {
                    pokemonName = await GetPokemonFormNameByFormId(pokemon_forms.id, langId);
                    speciesDexNumber = await GetPokemonSpeciesDexNumber(dexNumber);
                }

                string speciesIdentifier = pokemon_forms.identifier.Split("-")[0];
                List<pokemon_forms> pokemonForms = await _pokedexContext.pokemon_forms.Where(p => p.identifier.Contains(speciesIdentifier)).ToListAsync();
                if (pokemonForms.Count > 1)
                {
                    if (pokemon_forms != null)
                    {
                        formId = pokemon_forms.id;
                        forms = await GetPokemonForms(pokemon_forms.id, langId);
                        forms.RemoveAll(f => f != null && f.DexNumber == pokemon_forms.id);
                    }
                }

                return new PokemonDataDTO(
                    pokemonName,
                    speciesDexNumber != null ? (int)speciesDexNumber : dexNumber,
                    await _typeService.GetPokemonTypesWithEffectiveness(dexNumber, langId),
                    await _statService.GetPokemonStats(dexNumber, langId),
                    new SpriteDTO(dexNumber, pokemonSpriteUrl),
                    preEvolution: await GetPokemonPreEvolution(speciesDexNumber != null ? (int)speciesDexNumber : dexNumber, langId),
                    evolutions: await GetPokemonEvolutions(speciesDexNumber != null ? (int)speciesDexNumber : dexNumber, langId),
                    formId: formId,
                    forms: forms
                    );
            }
            return null;
        }

        public async Task<PokemonDataDTO?> GetPokemonDataByName(string name, int langId)
        {
            string speciesIdentifier = name.ToLower().Split("-")[0];
            pokemon_species_names? pokemonName = await _pokedexContext.pokemon_species_names.FirstOrDefaultAsync(p => p.name.ToLower() == name.ToLower());
            List<pokemon_forms> pokemonForms = await _pokedexContext.pokemon_forms.Where(p => p.identifier.Contains(speciesIdentifier)).ToListAsync();

            if (pokemonName != null)
            {
                List<FormDTO?>? forms = null;
                int? formId = null;
                if (pokemonForms.Count > 1)
                {
                    pokemon_forms? pokemon_forms = await _pokedexContext.pokemon_forms.FirstOrDefaultAsync(p => p.identifier == name.ToLower());
                    if(pokemon_forms != null)
                    {
                        formId = pokemon_forms.id;
                        forms = await GetPokemonForms(pokemon_forms.id, langId);
                        forms.RemoveAll(f => f != null && f.DexNumber == pokemon_forms.id);
                    }
                }

                return new PokemonDataDTO(
                    await GetPokemonName(pokemonName.pokemon_species_id, langId),
                    pokemonName.pokemon_species_id,
                    await _typeService.GetPokemonTypesWithEffectiveness(pokemonName.pokemon_species_id, langId),
                    await _statService.GetPokemonStats(pokemonName.pokemon_species_id, langId),
                    new SpriteDTO(pokemonName.pokemon_species_id, pokemonSpriteUrl),
                    preEvolution: await GetPokemonPreEvolution(pokemonName.pokemon_species_id, langId),
                    evolutions: await GetPokemonEvolutions(pokemonName.pokemon_species_id, langId),
                    formId: formId,
                    forms: forms
                    );
            }

            //If pokemon name is form name
            if (pokemonForms.Count > 0)
            {
                int? formId = null;
                pokemon_forms? pokemon_forms = await _pokedexContext.pokemon_forms.FirstOrDefaultAsync(p => p.identifier == name.ToLower());
                if (pokemon_forms != null)
                {
                    int dexNumber = pokemon_forms.pokemon_id;
                    formId = pokemon_forms.id;
                    pokemon_species? pokemon_species = await _pokedexContext.pokemon_species.FirstOrDefaultAsync(p => p.identifier == speciesIdentifier);
                    if (pokemon_species != null)
                    {
                        dexNumber = pokemon_species.id;
                    }

                    return new PokemonDataDTO(
                        await GetPokemonFormNameByFormId(pokemon_forms.id, langId),
                        dexNumber,
                        await _typeService.GetPokemonTypesWithEffectiveness(pokemon_forms.pokemon_id, langId),
                        await _statService.GetPokemonStats(pokemon_forms.pokemon_id, langId),
                        new SpriteDTO(pokemon_forms.pokemon_id, pokemonSpriteUrl),
                        preEvolution: await GetPokemonPreEvolution(dexNumber, langId),
                        evolutions: await GetPokemonEvolutions(dexNumber, langId),
                        formId: formId,
                        forms: await GetPokemonForms(pokemon_forms.id, langId));
                }
            }

            return null;
        }

        public async Task<PokemonPreviewDTO?> GetPokemonPreviewById(int id, int langId)
        {
            Pokemon? pokemon = await _pokeTeamContext.Pokemon.FirstOrDefaultAsync(t => t.Id == id);
            if (pokemon != null)
            {
                return await BuildPokemonPreviewDTO(pokemon, langId);
            }
            return null;
        }

        public async Task<List<PokemonPreviewDTO>> GetTeamPokemonPreviews(string id, int langId)
        {
            List<PokemonPreviewDTO> pokemonPreviewDTOs = new List<PokemonPreviewDTO>();

            Team? team = await _pokeTeamContext.Team.FirstOrDefaultAsync(t => t.Id == id);
            if (team != null)
            {
                List<Pokemon> pokemons = await _pokeTeamContext.Pokemon.Where(p => p.TeamId.Equals(team.Id)).ToListAsync();
                List<int> pokemonIds = pokemons.Select(p => p.Id).ToList();

                foreach (int pokemonId in pokemonIds)
                {
                    PokemonPreviewDTO? pokemonPreviewDTO = await GetPokemonPreviewById(pokemonId, langId);
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

        private async Task<LocalizedText?> GetPokemonFormNameByFormId(int formId, int langId)
        {
            var query =
                from pokemonForms in _pokedexContext.pokemon_forms.Where(p => p.id == formId)

                join pokemonFormNames in _pokedexContext.pokemon_form_names
                on new { Key1 = pokemonForms.id, Key2 = langId } equals new { Key1 = pokemonFormNames.pokemon_form_id, Key2 = pokemonFormNames.local_language_id } into pokemonFormNamesJoin
                from pokemonFormNames in pokemonFormNamesJoin.DefaultIfEmpty()

                join pokemonFormNamesDefault in _pokedexContext.pokemon_form_names
                on new { Key1 = pokemonForms.id, Key2 = (int)Lang.en } equals new { Key1 = pokemonFormNamesDefault.pokemon_form_id, Key2 = pokemonFormNamesDefault.local_language_id } into pokemonFormNamesDefaultJoin
                from pokemonFormNamesDefault in pokemonFormNamesDefaultJoin.DefaultIfEmpty()

                select pokemonFormNames != null ?
                    new LocalizedText(pokemonFormNames.pokemon_name != null ? pokemonFormNames.pokemon_name : pokemonFormNames.form_name, pokemonFormNames.local_language_id) :
                    new LocalizedText(pokemonFormNamesDefault.pokemon_name != null ? pokemonFormNamesDefault.pokemon_name : pokemonFormNamesDefault.form_name, pokemonFormNamesDefault.local_language_id);

            return await query.FirstOrDefaultAsync();
        }

        private async Task<int?> GetPokemonIdByFormId(int? formId)
        {
            int? pokemonId = null;
            if (formId != null)
            {
                pokemon_forms? pokemon_forms = await _pokedexContext.pokemon_forms.FirstOrDefaultAsync(p => p.id == formId);
                if (pokemon_forms != null)
                {
                    pokemonId = pokemon_forms.pokemon_id;
                }
            }
            return pokemonId;
        }

        private async Task<int?> GetPokemonSpeciesDexNumber(int dexNumber)
        {
            int? pokemonId = null;
            pokemon_forms? pokemon_forms = await _pokedexContext.pokemon_forms.FirstOrDefaultAsync(p => p.pokemon_id == dexNumber);
            if (pokemon_forms != null)
            {
                string speciesIdentifier = pokemon_forms.identifier.Split("-")[0];
                pokemon_species? pokemon_species = await _pokedexContext.pokemon_species.FirstOrDefaultAsync(p => p.identifier == speciesIdentifier);
                if (pokemon_species != null)
                {
                    pokemonId = pokemon_species.id;
                }
            }
            return pokemonId;
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
                            new SpriteDTO(newID, pokemonSpriteUrl),
                            evolutions: await GetPokemonEvolutions(newID, langId)));
                    }
                }
            }
            return evolutions;
        }

        private bool ArePokemonFormsExcluded(int dexNumber)
        {
            List<int> excludedPokemons = new List<int> { 25 };
            return excludedPokemons.Contains(dexNumber);
        }

        private async Task<List<FormDTO?>> GetPokemonForms(int formId, int langId)
        {
            List<FormDTO?> forms = new List<FormDTO?>();
            pokemon_forms? pokemon_forms = await _pokedexContext.pokemon_forms.FirstOrDefaultAsync(p => p.id == formId);
            if(pokemon_forms != null && !ArePokemonFormsExcluded(pokemon_forms.pokemon_id))
            {
                string speciesIdentifier = pokemon_forms.identifier.ToLower().Split("-")[0];
                int formOrder = pokemon_forms.form_order;
                List<pokemon_forms> pokemonForms = await _pokedexContext.pokemon_forms.Where(p => p.identifier.Contains(speciesIdentifier)).ToListAsync();
                if (pokemonForms.Count() > 0)
                {
                    foreach (pokemon_forms pokemonForm in pokemonForms)
                    {
                        if (pokemonForm != null)
                        {
                            LocalizedText? formName = await GetPokemonFormNameByFormId(pokemonForm.id, langId);
                            if(formName != null && formName.Content == null)
                            {
                                pokemon_species? pokemon_species = await _pokedexContext.pokemon_species.FirstOrDefaultAsync(p => p.identifier == speciesIdentifier);
                                if (pokemon_species != null)
                                {
                                    formName = await GetPokemonName(pokemon_species.id, langId);
                                }
                            }
                            forms.Add(new FormDTO(
                                formName,
                                pokemonForm.pokemon_id,
                                await _typeService.GetPokemonTypes(pokemonForm.pokemon_id, langId),
                                new SpriteDTO(pokemonForm.pokemon_id, pokemonSpriteUrl)));
                        }
                    }
                }
            }

            return forms;
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

            queryResults = queryResults.Union(formsQueryResults).ToList();

            return queryResults;
        }
    }
}
