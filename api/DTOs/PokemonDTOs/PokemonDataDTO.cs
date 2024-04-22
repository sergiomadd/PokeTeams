
namespace api.DTOs.PokemonDTOs
{
    public class PokemonDataDTO
    {
        public string? Name { get; set; }
        public int DexNumber { get; set; }
        public PokemonDataDTO? PreEvolution { get; set; }
        public List<PokemonDataDTO?>? Evolutions { get; set; }
        public PokeTypesWithEffectivenessDTO? Types { get; set; }
        public List<StatDTO?> Stats { get; set; }
        public List<SpriteDTO?> Sprites { get; set; }

        public PokemonDataDTO(string? name, int dexNumber, PokeTypesWithEffectivenessDTO types, List<StatDTO?> stats, List<SpriteDTO?> sprites, PokemonDataDTO? preEvolution = null, List<PokemonDataDTO?>? evolutions = null)
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
