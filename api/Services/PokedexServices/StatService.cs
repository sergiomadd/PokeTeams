using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Util;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace api.Services.PokedexServices
{
    public class StatService : IStatService
    {
        private readonly IPokedexContext _pokedexContext;
        private readonly IMemoryCache _cache;

        public StatService(IPokedexContext pokedexContext, IMemoryCache cache)
        {
            _pokedexContext = pokedexContext;
            _cache = cache;
        }

        public async Task<string?> GetStatNameByIdentifier(string identifier, int langId)
        {
            return await PokedexCache.GetOrCreateAsync(_cache, "stat-name", identifier, langId, async () => await FetchStatNameByIdentifier(identifier, langId));
        }

        private async Task<string?> FetchStatNameByIdentifier(string identifier, int langId)
        {
            string? statName = null;

            var query =
                from stats in _pokedexContext.stats.Where(i => i.identifier == identifier)

                join statNames in _pokedexContext.stat_names
                on new { Key1 = stats.id, Key2 = langId } equals new { Key1 = statNames.stat_id, Key2 = statNames.local_language_id } into statNamesJoin
                from statNames in statNamesJoin.DefaultIfEmpty()

                select statNames.name;

            statName = await query.FirstOrDefaultAsync();

            return statName;
        }

        public async Task<List<StatDTO>> GetDefaultStatList(int langId)
        {
            return await PokedexCache.GetOrCreateAsync(_cache, "default-stats", "all", langId, async () => await FetchDefaultStatList(langId)) ?? new List<StatDTO>();
        }

        private async Task<List<StatDTO>> FetchDefaultStatList(int langId)
        {
            List<StatDTO> pokeStats = new List<StatDTO>();
            var query =
                from stats in _pokedexContext.stats.Where(s => s.id < 7)

                join statNames in _pokedexContext.stat_names
                on new { Key1 = stats.id, Key2 = langId } equals new { Key1 = statNames.stat_id, Key2 = statNames.local_language_id } into statNamesJoin
                from statNames in statNamesJoin.DefaultIfEmpty()

                join statNamesDefault in _pokedexContext.stat_names
                on new { Key1 = stats.id, Key2 = (int)Lang.en } equals new { Key1 = statNamesDefault.stat_id, Key2 = statNamesDefault.local_language_id } into statNamesDefaultJoin
                from statNamesDefault in statNamesDefaultJoin.DefaultIfEmpty()

                select new StatDTO(
                    stats.identifier,
                    new LocalizedText(statNames != null ? statNames.name : statNamesDefault.name,
                    statNames != null ? statNames.local_language_id : statNamesDefault.local_language_id, statNamesDefault.name),
                    null);

            pokeStats = await query.ToListAsync();
            return pokeStats;
        }

        public async Task<List<StatDTO>> GetPokemonStats(int id, int langId)
        {
            return await PokedexCache.GetOrCreateAsync(_cache, "pokemon-stats", id.ToString(), langId, async () => await FetchPokemonStats(id, langId)) ?? new List<StatDTO>();
        }

        private async Task<List<StatDTO>> FetchPokemonStats(int id, int langId)
        {
            List<StatDTO> pokeStats = new List<StatDTO>();
            var query =
                from stats in _pokedexContext.stats.Where(s => s.id < 7)
                from pokemonStats in _pokedexContext.pokemon_stats.Where(s => s.pokemon_id == id && s.stat_id == stats.id)

                join statNames in _pokedexContext.stat_names
                on new { Key1 = stats.id, Key2 = langId } equals new { Key1 = statNames.stat_id, Key2 = statNames.local_language_id } into statNamesJoin
                from statNames in statNamesJoin.DefaultIfEmpty()

                join statNamesDefault in _pokedexContext.stat_names
                on new { Key1 = stats.id, Key2 = (int)Lang.en } equals new { Key1 = statNamesDefault.stat_id, Key2 = statNamesDefault.local_language_id } into statNamesDefaultJoin
                from statNamesDefault in statNamesDefaultJoin.DefaultIfEmpty()

                select new StatDTO(
                    stats.identifier,
                    new LocalizedText(statNames != null ? statNames.name : statNamesDefault.name,
                    statNames != null ? statNames.local_language_id : statNamesDefault.local_language_id, statNamesDefault.name),
                    pokemonStats.base_stat);

            pokeStats = await query.ToListAsync();
            return pokeStats;
        }
    }
}
