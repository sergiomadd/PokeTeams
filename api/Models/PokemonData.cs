using api.Models.DBPoketeamModels.Pokemon;
using api.Models.DTOs.PokemonDTOs;

namespace api.Models
{
    public class PokemonData
    {
        public string? Name { get; set; }
        public int DexNumber { get; set; }
        public PokemonData? PreEvolution { get; set; }
        public List<PokemonData?>? Evolutions { get; set; }
        public PokeTypes? Types { get; set; }
        public List<StatDTO?> Stats { get; set; }
        public List<Sprite?> Sprites { get; set; }

        public PokemonData(string? name, int dexNumber, PokeTypes types, List<StatDTO?> stats, List<Sprite?> sprites, PokemonData? preEvolution = null, List<PokemonData?>? evolutions = null)
        {
            Name = name;
            DexNumber = dexNumber;
            Types = types;
            Stats = stats;
            Sprites = sprites;
            PreEvolution = preEvolution; 
            Evolutions = evolutions;
        }
    }
}
