namespace api.Models
{
    public class Item
    {
        public string Identifier { get; set; }
        public string Name { get; set; }
        public string Prose { get; set; }

        public Item(string identifier, string name, string prose)
        {
            Identifier = identifier;
            Name = name;
            Prose = prose;
        }
    }
}
