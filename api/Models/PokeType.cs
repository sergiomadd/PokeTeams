namespace api.Models
{
    public class PokeType
    {
        public string Identifier { get; set; }
        public string Name { get; set; }

        public PokeType(string identifier, string name)
        {
            Identifier = identifier;
            Name = name;
        }
    }
}

