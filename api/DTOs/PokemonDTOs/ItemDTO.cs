namespace api.DTOs.PokemonDTOs
{
    public class ItemDTO
    {
        public string Identifier { get; set; }
        public LocalizedText? Name { get; set; }
        public LocalizedText? Prose { get; set; }
        public string IconPath { get; set; }

        public ItemDTO(string identifier, LocalizedText? name, LocalizedText? prose, string iconPath)
        {
            Identifier = identifier;
            Name = name;
            Prose = prose;
            IconPath = iconPath;
        }
    }
}
