namespace api.Models
{
    public class Item
    {
        public string Identifier { get; set; }
        public string Name { get; set; }
        public string Prose { get; set; }
        public string IconPath { get; set; }

        public Item(string identifier, string name, string prose, string pathStart)
        {
            Identifier = identifier;
            Name = name;
            Prose = prose;
            IconPath = $"{pathStart}{identifier}.png";
        }
    }
}
