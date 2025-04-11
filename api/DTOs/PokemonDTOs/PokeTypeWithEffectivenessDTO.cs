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


        public PokeTypeWithEffectivenessDTO(string identifier, LocalizedText name, string iconPath, EffectivenessDTO? effectivenessAttack = null, EffectivenessDTO? effectivenessDefense = null, bool teraType = false)
        {
            Identifier = identifier;
            Name = name;
            IconPath = iconPath;
            EffectivenessAttack = effectivenessAttack;
            EffectivenessDefense = effectivenessDefense;
            Teratype = teraType;
        }
    }
}

