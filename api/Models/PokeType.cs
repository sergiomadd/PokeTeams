namespace api.Models
{
    public class PokeType
    {
        public string Identifier { get; set; }
        public string Name { get; set; }
        public string IconPath { get; set; }
        public Effectiveness? EffectivenessAttack { get; set; }
        public Effectiveness? EffectivenessDefense { get; set; }
        public bool Teratype { get; set; }


        public PokeType(string identifier, string name, Effectiveness effectivenessAttack = null, Effectiveness effectivenessDefense = null, bool teraType = false)
        {
            Identifier = identifier;
            Name = name;
            EffectivenessAttack = effectivenessAttack;
            EffectivenessDefense = effectivenessDefense;
            Teratype = teraType ? teraType : false;
            var pathStart = "https://localhost:7134/images/sprites/types/generation-viii/";
            if (teraType)
            {
                pathStart = "https://localhost:7134/images/sprites/teratypes/";
            }

            IconPath = $"{pathStart}{identifier}.png";
        }
    }
}

