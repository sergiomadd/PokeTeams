using api.Models.DBPoketeamModels;

namespace api.DTOs.PokemonDTOs
{
    public class PokemonDTO
    {
        public LocalizedText? Name { get; set; }
        public string? Nickname { get; set; }
        public int DexNumber { get; set; }
        public int? FormId { get; set; }
        public EvolutionDTO? PreEvolution { get; set; }
        public List<EvolutionDTO?>? Evolutions { get; set; }
        public List<FormDTO?>? Forms { get; set; }
        public PokeTypesWithEffectivenessDTO? Types { get; set; }
        public PokeTypeWithEffectivenessDTO? TeraType { get; set; }
        public ItemDTO? Item { get; set; }
        public AbilityDTO? Ability { get; set; }
        public NatureDTO? Nature { get; set; }
        public List<MoveDTO?>? Moves { get; set; }
        public List<StatDTO> Stats { get; set; }
        public List<StatDTO?>? ivs { get; set; }
        public List<StatDTO?>? evs { get; set; }
        public int? Level { get; set; }
        public bool? Shiny { get; set; }
        public bool? Gender { get; set; }
        public SpriteDTO? Sprite { get; set; }
        public string? Notes { get; set; }
    }
}
