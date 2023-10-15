namespace api.Models
{
    public class PokeType
    {
        public string Identifier { get; set; }
        public string Name { get; set; }
        public List<Tuple<string, int>> EffectivenessAttack { get; set; }
        public List<Tuple<string, int>> EffectivenessDefense { get; set; }


        public PokeType(string identifier, string name, List<Tuple<string, int>> effectivenessAttack, List<Tuple<string, int>> effectivenessDefense)
        {
            Identifier = identifier;
            Name = name;
            EffectivenessAttack = effectivenessAttack;
            EffectivenessDefense = effectivenessDefense;
        }
    }
}

