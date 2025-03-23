using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBModels;
using Microsoft.EntityFrameworkCore;

namespace api.Services.PokedexServices
{
    public class NatureService : INatureService
    {
        private readonly IPokedexContext _pokedexContext;

        public NatureService(IPokedexContext pokedexContext)
        {
            _pokedexContext = pokedexContext;
        }

        public async Task<NatureDTO?> GetNatureByName(string name, int langId)
        {
            NatureDTO? nature = null;

            var query =
                from natureNamesInput in _pokedexContext.Nature_names.Where(n => n.name == name)

                join natures in _pokedexContext.Natures
                on new { Key1 = natureNamesInput.nature_id } equals new { Key1 = natures.id } into naturesJoin
                from natures in naturesJoin.DefaultIfEmpty()

                join natureNames in _pokedexContext.Nature_names
                on new { Key1 = natures.id, Key2 = langId } equals new { Key1 = natureNames.nature_id, Key2 = natureNames.local_language_id } into natureNamesJoin
                from natureNames in natureNamesJoin.DefaultIfEmpty()

                join natureNamesDefault in _pokedexContext.Nature_names
                on new { Key1 = natures.id, Key2 = (int)Lang.en } equals new { Key1 = natureNamesDefault.nature_id, Key2 = natureNamesDefault.local_language_id } into natureNamesDefaultJoin
                from natureNamesDefault in natureNamesDefaultJoin.DefaultIfEmpty()

                join increasedStat in _pokedexContext.Stats
                on new { Key1 = natures.increased_stat_id } equals new { Key1 = increasedStat.id } into increasedStatJoin
                from increasedStat in increasedStatJoin.DefaultIfEmpty()

                join decreasedStat in _pokedexContext.Stats
                on new { Key1 = natures.decreased_stat_id } equals new { Key1 = decreasedStat.id } into decreasedStatJoin
                from decreasedStat in decreasedStatJoin.DefaultIfEmpty()

                select new NatureDTO(
                    new LocalizedText(natureNames != null ? natureNames.name : natureNamesDefault.name,
                        natureNames != null ? natureNames.local_language_id : natureNamesDefault.local_language_id),
                    natures.identifier,
                    increasedStat.identifier,
                    decreasedStat.identifier);

            nature = await query.FirstOrDefaultAsync();

            return nature;
        }

        public async Task<NatureDTO?> GetNatureByIdentifier(string identifier, int langId)
        {
            NatureDTO? nature = null;

            var query =
                from natures in _pokedexContext.Natures.Where(i => i.identifier == identifier)

                join natureNames in _pokedexContext.Nature_names
                on new { Key1 = natures.id, Key2 = langId } equals new { Key1 = natureNames.nature_id, Key2 = natureNames.local_language_id } into natureNamesJoin
                from natureNames in natureNamesJoin.DefaultIfEmpty()

                join natureNamesDefault in _pokedexContext.Nature_names
                on new { Key1 = natures.id, Key2 = (int)Lang.en } equals new { Key1 = natureNamesDefault.nature_id, Key2 = natureNamesDefault.local_language_id } into natureNamesDefaultJoin
                from natureNamesDefault in natureNamesDefaultJoin.DefaultIfEmpty()

                join increasedStat in _pokedexContext.Stats
                on new { Key1 = natures.increased_stat_id } equals new { Key1 = increasedStat.id } into increasedStatJoin
                from increasedStat in increasedStatJoin.DefaultIfEmpty()

                join decreasedStat in _pokedexContext.Stats
                on new { Key1 = natures.decreased_stat_id } equals new { Key1 = decreasedStat.id } into decreasedStatJoin
                from decreasedStat in decreasedStatJoin.DefaultIfEmpty()

                select new NatureDTO(
                    new LocalizedText(natureNames != null ? natureNames.name : natureNamesDefault.name,
                        natureNames != null ? natureNames.local_language_id : natureNamesDefault.local_language_id),
                    natures.identifier,
                    increasedStat.identifier,
                    decreasedStat.identifier);

            nature = await query.FirstOrDefaultAsync();

            return nature;
        }

        public async Task<List<NatureDTO>> GetAllNatures(int langId)
        {
            List<NatureDTO> natureDTOs = new List<NatureDTO>();
            List<Natures> naturesList = await _pokedexContext.Natures.ToListAsync();
            if (naturesList != null)
            {
                foreach (Natures naturesItem in naturesList)
                {
                    var query =
                        from natures in _pokedexContext.Natures.Where(i => i.id == naturesItem.id)

                        join natureNames in _pokedexContext.Nature_names
                        on new { Key1 = natures.id, Key2 = langId } equals new { Key1 = natureNames.nature_id, Key2 = natureNames.local_language_id } into natureNamesJoin
                        from natureNames in natureNamesJoin.DefaultIfEmpty()

                        join natureNamesDefault in _pokedexContext.Nature_names
                        on new { Key1 = natures.id, Key2 = (int)Lang.en } equals new { Key1 = natureNamesDefault.nature_id, Key2 = natureNamesDefault.local_language_id } into natureNamesDefaultJoin
                        from natureNamesDefault in natureNamesDefaultJoin.DefaultIfEmpty()

                        join increasedStat in _pokedexContext.Stats
                        on new { Key1 = natures.increased_stat_id } equals new { Key1 = increasedStat.id } into increasedStatJoin
                        from increasedStat in increasedStatJoin.DefaultIfEmpty()

                        join decreasedStat in _pokedexContext.Stats
                        on new { Key1 = natures.decreased_stat_id } equals new { Key1 = decreasedStat.id } into decreasedStatJoin
                        from decreasedStat in decreasedStatJoin.DefaultIfEmpty()

                        select new NatureDTO(
                            new LocalizedText(natureNames != null ? natureNames.name : natureNamesDefault.name,
                                natureNames != null ? natureNames.local_language_id : natureNamesDefault.local_language_id),
                            natures.identifier,
                            increasedStat.identifier,
                            decreasedStat.identifier);

                    NatureDTO? natureDTO = await query.FirstOrDefaultAsync();
                    if (natureDTO != null) { natureDTOs.Add(natureDTO); }
                }
            }
            return natureDTOs;
        }

        public async Task<List<QueryResultDTO>> QueryNaturesByName(string key, int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<Nature_names> natureNames = await _pokedexContext.Nature_names.Where(i => i.name.Contains(key) && i.local_language_id == langId).ToListAsync();
            if (natureNames == null)
            {
                natureNames = await _pokedexContext.Nature_names.Where(i => i.name.Contains(key) && i.local_language_id == (int)Lang.en).ToListAsync();
            }
            if (natureNames != null && natureNames.Count > 0)
            {
                foreach (var natureName in natureNames)
                {
                    queryResults.Add(new QueryResultDTO(natureName.name, natureName.nature_id.ToString()));
                }
            }
            return queryResults;
        }

        public async Task<List<QueryResultDTO>> QueryAllNatures(int langId)
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();
            List<Natures> naturesList = await _pokedexContext.Natures.ToListAsync();
            if (naturesList != null)
            {
                foreach (Natures natures in naturesList)
                {
                    Nature_names? natureNames = await _pokedexContext.Nature_names.FirstOrDefaultAsync(n => n.nature_id == natures.id && n.local_language_id == langId);
                    if (natureNames == null)
                    {
                        natureNames = await _pokedexContext.Nature_names.FirstOrDefaultAsync(n => n.nature_id == natures.id && n.local_language_id == (int)Lang.en);
                    }
                    queryResults.Add(new QueryResultDTO(natureNames.name, natures.identifier));
                }
            }
            return queryResults;
        }

    }
}
