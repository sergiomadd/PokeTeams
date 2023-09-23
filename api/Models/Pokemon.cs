namespace api.Models
{
    public class Pokemon
    {
        public string Name { get; set; }
        public int DexNumber { get; set; }
        public List<string> Stats { get; set; }

        public Pokemon(string name, int dexNumber, List<string> stats)
        {
            Name = name;
            DexNumber = dexNumber;
            Stats = stats;
        }
    }
}
