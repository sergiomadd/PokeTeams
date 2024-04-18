namespace api.Models.DBPoketeamModels.Pokemon
{
    public class Stat
    {
        public string? Identifier { get; set; }
        public string? Name { get; set; }
        public int? Value { get; set; }
        public Stat(string? identifier, string? name, int? value)
        {
            Identifier = identifier;
            Name = name;
            Value = value;
        }
    }
}
