namespace api.Models.DBPoketeamModels.Pokemon
{
    public class Ability
    {
        public string Identifier { get; set; }
        public string Name { get; set; }
        public string Prose { get; set; }

        public Ability(string identifier, string name, string prose)
        {
            Identifier = identifier;
            Name = name;
            Prose = prose;
        }
    }
}
