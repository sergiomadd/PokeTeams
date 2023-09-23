namespace api.Models
{
    public class Pokemon
    {
        public string Name { get; set; }
        public int DexNumber { get; set; }
        public List<PokeType> Types { get; set; }
        public List<Stat> Stats { get; set; }

        public Pokemon(string name, int dexNumber, List<PokeType> types, List<Stat> stats)
        {
            Name = name;
            DexNumber = dexNumber;
            Types = types;
            Stats = stats;
        }
    }
}
