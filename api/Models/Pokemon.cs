namespace api.Models
{
    public class Pokemon
    {
        public string? Name { get; set; }
        public int DexNumber { get; set; }
        public Pokemon? PreEvolution { get; set; }
        public Pokemon? Evolution { get; set; }
        public PokeTypes? Types { get; set; }
        public List<Stat?> Stats { get; set; }
        public List<Sprite?> Sprites { get; set; }

        public Pokemon(string? name, int dexNumber, PokeTypes types, List<Stat?> stats, List<Sprite?> sprites, Pokemon? preEvolution = null, Pokemon? evolution = null)
        {
            Name = name;
            DexNumber = dexNumber;
            Types = types;
            Stats = stats;
            Sprites = sprites;
            PreEvolution = preEvolution;
            Evolution = evolution;
        }
    }
}
