namespace api.Models
{
    public class Pokemon
    {
        public string Name { get; set; }
        public int DexNumber { get; set; }
        public List<PokeType> Types { get; set; }
        public List<Stat> Stats { get; set; }
        public Sprites Sprites { get; set; }

        public Pokemon(string name, int dexNumber, List<PokeType> types, List<Stat> stats, Sprites sprites)
        {
            Name = name;
            DexNumber = dexNumber;
            Types = types;
            Stats = stats;
            Sprites = sprites;
        }
    }
}
