namespace api.Models.DBPoketeamModels.Pokemon
{
    public class Ability
    {
        public string Name { get; set; }
        public string Prose { get; set; }

        public Ability(string name, string prose)
        {
            Name = name;
            Prose = prose;
        }
    }
}
