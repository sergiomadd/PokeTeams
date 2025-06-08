using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using Microsoft.EntityFrameworkCore;

namespace api.Services.PokedexServices
{
    public class StatService : IStatService
    {
        private readonly IPokedexContext _pokedexContext;

        public StatService(IPokedexContext pokedexContext)
        {
            _pokedexContext = pokedexContext;
        }

        public async Task<string?> GetStatNameByIdentifier(string identifier, int langId)
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
