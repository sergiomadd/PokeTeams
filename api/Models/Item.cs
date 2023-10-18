namespace api.Models
{
    public class Item
    {
        public string Identifier { get; set; }
        public string Name { get; set; }
        public string Prose { get; set; }
        public string IconPath { get; set; }
        string pathStart = "https://localhost:7134/images/sprites/items/";


        public Item(string identifier, string name, string prose)
        {
            Identifier = identifier;
            Name = name;
            Prose = prose;
            IconPath = $"{pathStart}{identifier}.png";
        }
    }
}
