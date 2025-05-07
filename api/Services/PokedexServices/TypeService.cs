using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBModels;
using Microsoft.EntityFrameworkCore;


namespace api.Services.PokedexServices
{
    public class TypeService : ITypeService
    {
        private readonly IPokedexContext _pokedexContext;
        private readonly IConfiguration _config;
        private readonly string pokeTypeIconPath;
        private readonly string pokeTypeTeraIconPath;
        private string baseUrl;

        public TypeService(IPokedexContext pokedexContext, IConfiguration config)
        {
            _pokedexContext = pokedexContext;
            _config = config;

            baseUrl = "";
            string? baseUrlTemp = _config["BaseUrl"];
            if (baseUrlTemp != null)
            {
                baseUrl = (string)baseUrlTemp;
            }
            pokeTypeIconPath = $"{baseUrl}images/types/";
            pokeTypeTeraIconPath = $"{baseUrl}images/teratypes/";
        }

        public async Task<PokeTypeDTO?> GetTypeById(int id, int langId, bool teraType = false)
        {
            PokeTypeDTO? pokeType = null;

            var query =
                from types in _pokedexContext.types.Where(t => t.id == id)

                join typeNames in _pokedexContext.type_names
                on new { Key1 = types.id, Key2 = langId } equals new { Key1 = typeNames.type_id, Key2 = typeNames.local_language_id } into typeNamesJoin
                from typeNames in typeNamesJoin.DefaultIfEmpty()

                join typeNamesDefault in _pokedexContext.type_names
                on new { Key1 = types.id, Key2 = (int)Lang.en } equals new { Key1 = typeNamesDefault.type_id, Key2 = typeNamesDefault.local_language_id } into typeNamesDefaultJoin
                from typeNamesDefault in typeNamesDefaultJoin.DefaultIfEmpty()

                select new PokeTypeDTO(
                    types.identifier,
                    typeNames != null ?
                        new LocalizedText(typeNames.name, typeNames.local_language_id) :
                        new LocalizedText(typeNamesDefault.name, typeNames.local_language_id),
                    teraType ? $"{pokeTypeTeraIconPath}{types.identifier}.png" : $"{pokeTypeIconPath}{types.identifier}.png",
                    teraType);

            pokeType = await query.FirstOrDefaultAsync();

            return pokeType;
        }

        public async Task<PokeTypeDTO?> GetTypeByIdentifier(string identifier, bool teraType, int langId)
        {
            PokeTypeDTO? pokeType = null;

            var query =
                from types in _pokedexContext.types.Where(t => t.identifier == identifier)

                join typeNames in _pokedexContext.type_names
                on new { Key1 = types.id, Key2 = langId } equals new { Key1 = typeNames.type_id, Key2 = typeNames.local_language_id } into typeNamesJoin
                from typeNames in typeNamesJoin.DefaultIfEmpty()

                join typeNamesDefault in _pokedexContext.type_names
                on new { Key1 = types.id, Key2 = (int)Lang.en } equals new { Key1 = typeNamesDefault.type_id, Key2 = typeNamesDefault.local_language_id } into typeNamesDefaultJoin
                from typeNamesDefault in typeNamesDefaultJoin.DefaultIfEmpty()

                select new PokeTypeDTO(
                    types.identifier,
                    typeNames != null ?
                        new LocalizedText(typeNames.name, typeNames.local_language_id) :
                        new LocalizedText(typeNamesDefault.name, typeNames.local_language_id),
                    teraType ? $"{pokeTypeTeraIconPath}{types.identifier}.png" : $"{pokeTypeIconPath}{types.identifier}.png",
                    teraType);

            pokeType = await query.FirstOrDefaultAsync();

            return pokeType;
        }

        public async Task<PokeTypeWithEffectivenessDTO?> GetTypeWithEffectivenessById(int id, int langId)
        {
            PokeTypeWithEffectivenessDTO? pokeType = null;

            var query =
                from types in _pokedexContext.types.Where(t => t.id == id)

                join typeNames in _pokedexContext.type_names
                on new { Key1 = types.id, Key2 = langId } equals new { Key1 = typeNames.type_id, Key2 = typeNames.local_language_id } into typeNamesJoin
                from typeNames in typeNamesJoin.DefaultIfEmpty()

                join typeNamesDefault in _pokedexContext.type_names
                on new { Key1 = types.id, Key2 = (int)Lang.en } equals new { Key1 = typeNamesDefault.type_id, Key2 = typeNamesDefault.local_language_id } into typeNamesDefaultJoin
                from typeNamesDefault in typeNamesDefaultJoin.DefaultIfEmpty()

                select new PokeTypeWithEffectivenessDTO(
                    types.identifier,
                    typeNames != null ?
                        new LocalizedText(typeNames.name, typeNames.local_language_id) :
                        new LocalizedText(typeNamesDefault.name, typeNames.local_language_id),
                    $"{pokeTypeIconPath}{types.identifier}.png",
                    null,
                    null,
                    false);

            pokeType = await query.FirstOrDefaultAsync();

            if (pokeType != null)
            {
                pokeType.EffectivenessAttack = await GetTypeEffectivenessAttack(id, langId);
                pokeType.EffectivenessDefense = await GetTypeEffectivenessDefense(id, langId);
            }

            return pokeType;
        }

        public async Task<PokeTypeWithEffectivenessDTO?> GetTypeWithEffectivenessByIdentifier(string identifier, int langId, bool teraType = false)
        {
            PokeTypeWithEffectivenessDTO? pokeType = null;

            var query =
                from types in _pokedexContext.types.Where(t => t.identifier == identifier)

                join typeNames in _pokedexContext.type_names
                on new { Key1 = types.id, Key2 = langId } equals new { Key1 = typeNames.type_id, Key2 = typeNames.local_language_id } into typeNamesJoin
                from typeNames in typeNamesJoin.DefaultIfEmpty()

                join typeNamesDefault in _pokedexContext.type_names
                on new { Key1 = types.id, Key2 = (int)Lang.en } equals new { Key1 = typeNamesDefault.type_id, Key2 = typeNamesDefault.local_language_id } into typeNamesDefaultJoin
                from typeNamesDefault in typeNamesDefaultJoin.DefaultIfEmpty()

                select new PokeTypeWithEffectivenessDTO(
                    types.identifier,
                    typeNames != null ?
                        new LocalizedText(typeNames.name, typeNames.local_language_id) :
                        new LocalizedText(typeNamesDefault.name, typeNames.local_language_id),
                    teraType ? $"{pokeTypeTeraIconPath}{types.identifier}.png" : $"{pokeTypeIconPath}{types.identifier}.png",
                    null,
                    null,
                    false);

            pokeType = await query.FirstOrDefaultAsync();

            int? id = _pokedexContext.types.Where(t => t.identifier == identifier).FirstOrDefaultAsync().Result?.id;

            if (pokeType != null && id != null)
            {
                pokeType.EffectivenessAttack = await GetTypeEffectivenessAttack((int)id, langId);
                pokeType.EffectivenessDefense = await GetTypeEffectivenessDefense((int)id, langId);
            }

            return pokeType;
        }

        public async Task<EffectivenessDTO?> GetTypeEffectivenessAttack(int id, int langId)
        {
            EffectivenessDTO? effectiveness = null;
            List<Tuple<PokeTypeDTO, double>> allValues = new List<Tuple<PokeTypeDTO, double>>();
            List<type_efficacy> typeEfficacyList = await _pokedexContext.type_efficacy.Where(t => t.damage_type_id == id && t.damage_factor != 100).ToListAsync();
            if (typeEfficacyList != null)
            {
                foreach (var typeEfficacy in typeEfficacyList)
                {
                    PokeTypeDTO? type = await GetTypeById(typeEfficacy.target_type_id, langId);
                    if (type != null)
                    {
                        allValues.Add(new(type, typeEfficacy.damage_factor / (double)100));
                    }
                }
                effectiveness = new EffectivenessDTO(allValues);
            }
            if(effectiveness != null && (effectiveness.AllValues == null || !effectiveness.AllValues.Any()))
            {
                effectiveness = null;
            }
            return effectiveness;
        }

        public async Task<EffectivenessDTO?> GetTypeEffectivenessDefense(int id, int langId)
        {
            EffectivenessDTO? effectiveness = null;
            List<Tuple<PokeTypeDTO, double>> allValues = new List<Tuple<PokeTypeDTO, double>>(); ;
            List<type_efficacy> typeEfficacyList = await _pokedexContext.type_efficacy.Where(t => t.target_type_id == id && t.damage_factor != 100).ToListAsync();
            if (typeEfficacyList != null)
            {
                foreach (var typeEfficacy in typeEfficacyList)
                {
                    PokeTypeDTO? type = await GetTypeById(typeEfficacy.damage_type_id, langId);
                    if (type != null)
                    {
                        allValues.Add(new(type, typeEfficacy.damage_factor / (double)100));
                    }
                }
                effectiveness = new EffectivenessDTO(allValues);
            }
            if (effectiveness != null && (effectiveness.AllValues == null || !effectiveness.AllValues.Any()))
            {
                effectiveness = null;
            }
            return effectiveness;
        }

        public async Task<PokeTypesDTO?> GetPokemonTypes(int id, int langId)
        {
            PokeTypeDTO? type1 = null;
            pokemon_types? pokemonType1 = await _pokedexContext.pokemon_types.FirstOrDefaultAsync(t => t.pokemon_id == id && t.slot == 1);
            if (pokemonType1 != null)
            {
                type1 = GetTypeById(pokemonType1.type_id, langId).Result;
            }
            PokeTypeDTO? type2 = null;
            pokemon_types? pokemonType2 = await _pokedexContext.pokemon_types.FirstOrDefaultAsync(t => t.pokemon_id == id && t.slot == 2);
            if (pokemonType2 != null)
            {
                type2 = GetTypeById(pokemonType2.type_id, langId).Result;
            }
            if (type1 == null) { return null; }
            PokeTypesDTO pokeTypes = new PokeTypesDTO
            {
                Type1 = type1,
                Type2 = type2
            };
            return pokeTypes;
        }

        public async Task<PokeTypesWithEffectivenessDTO?> GetPokemonTypesWithEffectiveness(int id, int langId)
        {
            PokeTypesWithEffectivenessDTO? pokeTypes = null;

            PokeTypeWithEffectivenessDTO? type1 = null;
            pokemon_types? pokemonType1 = await _pokedexContext.pokemon_types.FirstOrDefaultAsync(t => t.pokemon_id == id && t.slot == 1);
            if (pokemonType1 != null)
            {
                type1 = await GetTypeWithEffectivenessById(pokemonType1.type_id, langId);
            }
            PokeTypeWithEffectivenessDTO? type2 = null;
            pokemon_types? pokemonType2 = await _pokedexContext.pokemon_types.FirstOrDefaultAsync(t => t.pokemon_id == id && t.slot == 2);
            if (pokemonType2 != null)
            {
                type2 = await GetTypeWithEffectivenessById(pokemonType2.type_id, langId);
            }
            if (type1 == null) { return null; }
            pokeTypes = new PokeTypesWithEffectivenessDTO(type1, type2);
            return pokeTypes;
        }

        public async Task<List<PokeTypeDTO>> GetAllTypes(int langId)
        {
            List<PokeTypeDTO> pokeTypes = new List<PokeTypeDTO>();

            var query =
                from types in _pokedexContext.types

                join typeNames in _pokedexContext.type_names
                on new { Key1 = types.id, Key2 = langId } equals new { Key1 = typeNames.type_id, Key2 = typeNames.local_language_id } into typeNamesJoin
                from typeNames in typeNamesJoin.DefaultIfEmpty()

                join typeNamesDefault in _pokedexContext.type_names
                on new { Key1 = types.id, Key2 = (int)Lang.en } equals new { Key1 = typeNamesDefault.type_id, Key2 = typeNamesDefault.local_language_id } into typeNamesDefaultJoin
                from typeNamesDefault in typeNamesDefaultJoin.DefaultIfEmpty()

                select new PokeTypeDTO(
                    types.identifier,
                    typeNames != null ?
                        new LocalizedText(typeNames.name, typeNames.local_language_id) :
                        new LocalizedText(typeNamesDefault.name, typeNames.local_language_id),
                    $"{pokeTypeIconPath}{types.identifier}.png",
                    false);

            pokeTypes = await query.ToListAsync();

            //Avoid adding last 2 types -> (unkown, shadow) UNSUPPORTED
            if(pokeTypes.Count > 2)
            {
                pokeTypes.RemoveAt(pokeTypes.Count - 1);
                pokeTypes.RemoveAt(pokeTypes.Count - 1);
            }

            return pokeTypes;
        }

        public async Task<List<PokeTypeDTO>> GetAllTeraTypes(int langId)
        {
            List<PokeTypeDTO> pokeTypes = new List<PokeTypeDTO>();

            var query =
                from types in _pokedexContext.types

                join typeNames in _pokedexContext.type_names
                on new { Key1 = types.id, Key2 = langId } equals new { Key1 = typeNames.type_id, Key2 = typeNames.local_language_id } into typeNamesJoin
                from typeNames in typeNamesJoin.DefaultIfEmpty()

                join typeNamesDefault in _pokedexContext.type_names
                on new { Key1 = types.id, Key2 = (int)Lang.en } equals new { Key1 = typeNamesDefault.type_id, Key2 = typeNamesDefault.local_language_id } into typeNamesDefaultJoin
                from typeNamesDefault in typeNamesDefaultJoin.DefaultIfEmpty()

                select new PokeTypeDTO(
                    types.identifier,
                    typeNames != null ?
                        new LocalizedText(typeNames.name, typeNames.local_language_id) :
                        new LocalizedText(typeNamesDefault.name, typeNames.local_language_id),
                    $"{pokeTypeTeraIconPath}{types.identifier}.png",
                    true);

            pokeTypes = await query.ToListAsync();

            if (pokeTypes.Count > 2)
            {
                pokeTypes.RemoveAt(pokeTypes.Count - 1);
                pokeTypes.RemoveAt(pokeTypes.Count - 1);
            }

            return pokeTypes;
        }

        public async Task<List<QueryResultDTO>> QueryTypesByName(string key, int langId, bool teraType = false)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            string path = teraType ? pokeTypeTeraIconPath : pokeTypeTeraIconPath;

            var query =
                from typeNames in _pokedexContext.type_names.Where(i => i.name.ToLower().StartsWith(key.ToLower()) && i.local_language_id == langId && i.type_id <= 19)

                join types in _pokedexContext.types
                on new { Key1 = typeNames.type_id } equals new { Key1 = types.id } into typesJoin
                from types in typesJoin.DefaultIfEmpty()

                join typeNamesDefault in _pokedexContext.type_names
                on new { Key1 = typeNames.type_id, Key2 = (int)Lang.en } equals new { Key1 = typeNamesDefault.type_id, Key2 = typeNamesDefault.local_language_id } into typeNamesDefaultJoin
                from typeNamesDefault in typeNamesDefaultJoin.DefaultIfEmpty()

                select typeNames != null ? new QueryResultDTO(typeNames.name, types.identifier, $"{path}{types.identifier}.png", "type") :
                    new QueryResultDTO(typeNamesDefault.name, types.identifier, $"{path}{types.identifier}.png", "type");

            queryResults = await query.ToListAsync();

            return queryResults;
        }

        public async Task<List<QueryResultDTO>> QueryAllTeraTypes(int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            var query =
                from types in _pokedexContext.types

                join typeNames in _pokedexContext.type_names
                on new { Key1 = types.id, Key2 = langId } equals new { Key1 = typeNames.type_id, Key2 = typeNames.local_language_id } into typeNamesJoin
                from typeNames in typeNamesJoin.DefaultIfEmpty()

                join typeNamesDefault in _pokedexContext.type_names
                on new { Key1 = types.id, Key2 = (int)Lang.en } equals new { Key1 = typeNamesDefault.type_id, Key2 = typeNamesDefault.local_language_id } into typeNamesDefaultJoin
                from typeNamesDefault in typeNamesDefaultJoin.DefaultIfEmpty()

                select typeNames != null ? new QueryResultDTO(typeNames.name, types.identifier, $"{pokeTypeTeraIconPath}{types.identifier}.png", "type") :
                    new QueryResultDTO(typeNamesDefault.name, types.identifier, $"{pokeTypeTeraIconPath}{types.identifier}.png", "type");

            queryResults = await query.ToListAsync();

            if (queryResults.Count > 2)
            {
                queryResults.RemoveAt(queryResults.Count - 1);
                queryResults.RemoveAt(queryResults.Count - 1);
            }

            return queryResults;
        }
    }
}
