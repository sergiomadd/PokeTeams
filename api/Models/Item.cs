namespace api.Models
{
    public class Item
    {
        public string Name { get; set; }
        public string Prose { get; set; }

        public Item(string name, string prose)
        {
            Name = name;
            Prose = prose;
        }
    }
}
