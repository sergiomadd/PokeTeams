using Microsoft.Extensions.Caching.Memory;

namespace api.Util
{
    //Shared cache-aside helper for the Pokedex reference-data services (moves, items, abilities,
    //natures, types, stats): that data only changes when load_pokedex_db.sh is rerun, so it's safe
    //to serve repeat lookups straight out of memory instead of hitting Postgres every time.
    public static class PokedexCache
    {
        //Pokedex data only actually changes when load_pokedex_db.sh is rerun (roughly monthly), and the
        //API gets restarted after that reload to clear the cache immediately — this TTL is just a safety
        //net for a forgotten restart, not the real invalidation mechanism, so it can be long.
        public static readonly TimeSpan DefaultTtl = TimeSpan.FromDays(7);

        public static async Task<TValue?> GetOrCreateAsync<TValue>(
            IMemoryCache cache,
            string category,
            string key,
            int langId,
            Func<Task<TValue?>> fetch,
            TimeSpan? ttl = null)
            where TValue : class
        {
            string cacheKey = $"pokedex:{category}:{key}:{langId}";
            if (cache.TryGetValue(cacheKey, out TValue? cached))
            {
                return cached;
            }

            TValue? value = await fetch();
            if (value != null)
            {
                cache.Set(cacheKey, value, ttl ?? DefaultTtl);
            }
            return value;
        }

        public static async Task<Dictionary<string, TValue>> GetOrCreateManyAsync<TValue>(
            IMemoryCache cache,
            string category,
            List<string> identifiers,
            int langId,
            Func<List<string>, Task<Dictionary<string, TValue>>> fetchMissing,
            TimeSpan? ttl = null)
            where TValue : class
        {
            Dictionary<string, TValue> result = new Dictionary<string, TValue>();
            List<string> missing = new List<string>();

            foreach (string identifier in identifiers.Distinct())
            {
                string cacheKey = $"pokedex:{category}:{identifier}:{langId}";
                if (cache.TryGetValue(cacheKey, out TValue? cached) && cached != null)
                {
                    result[identifier] = cached;
                }
                else
                {
                    missing.Add(identifier);
                }
            }

            if (missing.Count > 0)
            {
                Dictionary<string, TValue> fetched = await fetchMissing(missing);
                foreach (KeyValuePair<string, TValue> entry in fetched)
                {
                    cache.Set($"pokedex:{category}:{entry.Key}:{langId}", entry.Value, ttl ?? DefaultTtl);
                    result[entry.Key] = entry.Value;
                }
            }

            return result;
        }
    }
}
