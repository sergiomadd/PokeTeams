namespace api.DTOs.PokemonDTOs
{
    public class ItemDTO
    {
        public string Identifier { get; set; }
        public LocalizedText? Name { get; set; }
        public LocalizedText? Prose { get; set; }
        public string IconPath { get; set; }

        string pathStart = "https://localhost:7134/images/sprites/items/";

        public ItemDTO(string identifier, LocalizedText? name, LocalizedText? prose)
        {
            Identifier = identifier;
            Name = name;
            Prose = prose;
            IconPath = $"{pathStart}{identifier}.png";
        }
    }
}
