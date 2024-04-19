using api.Models.DBPoketeamModels;

namespace api.Models.DTOs.PokemonDTOs
{
    public class PokemonDTO
    {
        public string? Name { get; set; }
        public string? Nickname { get; set; }
        public int? DexNumber { get; set; }
        public PokemonData? PreEvolution { get; set; }
        public List<PokemonData?>? Evolutions { get; set; }
        public PokeTypes? Types { get; set; }
        public PokeTypeDTO? TeraType { get; set; }
        public ItemDTO? Item { get; set; }
        public AbilityDTO? Ability { get; set; }
        public NatureDTO? Nature { get; set; }
        public List<MoveDTO>? Moves { get; set; }
        public List<Stat?> Stats { get; set; }
        public List<Stat?> ivs { get; set; }
        public List<Stat?> evs { get; set; }
        public int? Level { get; set; }
        public bool? Shiny { get; set; }
        public string? Gender { get; set; }
        public List<Sprite?> Sprites { get; set; }
    }
}
