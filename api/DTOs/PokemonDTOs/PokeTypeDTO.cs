namespace api.DTOs.PokemonDTOs
{
    public class PokeTypeDTO
    {
        public string Identifier { get; set; }
        public LocalizedText Name { get; set; }
        public string IconPath { get; set; }
        public bool Teratype { get; set; }

        public PokeTypeDTO(string identifier, LocalizedText name, string iconPath, bool teraType = false)
        {
            Identifier = identifier;
            Name = name;
            Teratype = teraType ? teraType : false;
            IconPath = iconPath;
        }
    }
}
