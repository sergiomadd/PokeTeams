namespace api.DTOs.PokemonDTOs
{
    public class PokeTypeWithEffectivenessDTO
    {
        public string Identifier { get; set; }
        public LocalizedText Name { get; set; }
        public string IconPath { get; set; }
        public EffectivenessDTO? EffectivenessAttack { get; set; }
        public EffectivenessDTO? EffectivenessDefense { get; set; }
        public bool Teratype { get; set; }


        public PokeTypeWithEffectivenessDTO(string identifier, LocalizedText name, EffectivenessDTO? effectivenessAttack = null, EffectivenessDTO? effectivenessDefense = null, bool teraType = false)
        {
            Identifier = identifier;
            Name = name;
            EffectivenessAttack = effectivenessAttack;
            EffectivenessDefense = effectivenessDefense;
            Teratype = teraType ? teraType : false;
            var pathStart = "https://localhost:7134/images/sprites/types/generation-ix/";
            if (teraType)
            {
                pathStart = "https://localhost:7134/images/sprites/teratypes/";
            }

            IconPath = $"{pathStart}{identifier}.png";
        }
    }
}

