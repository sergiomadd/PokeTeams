namespace api.Models
{
    public class ItemModel
    {
        public string Name { get; set; }
        public string Prose { get; set; }

        public ItemModel(string name, string prose)
        {
            Name = name;
            Prose = prose;
        }
    }
}
