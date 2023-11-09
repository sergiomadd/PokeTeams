namespace api.Models
{
    public class PokeType
    {
        public string Identifier { get; set; }
        public string Name { get; set; }
        public string IconPath { get; set; }
        public List<Tuple<string, int>> EffectivenessAttack { get; set; }
        public List<Tuple<string, int>> EffectivenessDefense { get; set; }
        public bool Teratype { get; set; }
        string pathStart;


        public PokeType(string identifier, string name, List<Tuple<string, int>> effectivenessAttack, List<Tuple<string, int>> effectivenessDefense, bool teraType = false)
        {
            Identifier = identifier;
            Name = name;
            EffectivenessAttack = effectivenessAttack;
            EffectivenessDefense = effectivenessDefense;
            Teratype = teraType ? teraType : false;
            pathStart = "https://localhost:7134/images/sprites/types/generation-viii/";
            if (teraType)
            {
                pathStart = "https://localhost:7134/images/sprites/teratypes/";
            }

            IconPath = $"{pathStart}{identifier}.png";
        }
    }
}

