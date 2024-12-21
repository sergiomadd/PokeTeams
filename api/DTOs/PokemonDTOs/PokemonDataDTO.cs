
namespace api.DTOs.PokemonDTOs
{
    public class PokemonDataDTO
    {
        public LocalizedText? Name { get; set; }
        public int DexNumber { get; set; }
        public PokemonDataDTO? PreEvolution { get; set; }
        public List<PokemonDataDTO?>? Evolutions { get; set; }
        public PokeTypesWithEffectivenessDTO? Types { get; set; }
        public List<StatDTO?> Stats { get; set; }
        public SpriteDTO? Sprite { get; set; }

        public PokemonDataDTO(LocalizedText? name, int dexNumber, PokeTypesWithEffectivenessDTO types, List<StatDTO?> stats, SpriteDTO? sprite, PokemonDataDTO? preEvolution = null, List<PokemonDataDTO?>? evolutions = null)
        {
            Name = name;
            DexNumber = dexNumber;
            Types = types;
            Stats = stats;
            Sprite = sprite;
            PreEvolution = preEvolution;
            Evolutions = evolutions;
        }
    }
}
