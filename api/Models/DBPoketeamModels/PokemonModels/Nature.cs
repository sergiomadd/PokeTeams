namespace api.Models.DBPoketeamModels.Pokemon
{
    public class Nature
    {
        public string Name { get; set; }
        public string Identifier { get; set; }
        public Stat IncreasedStat { get; set; }
        public Stat DecreasedStat { get; set; }

        public Nature(string name, string identifier, Stat increasedStat, Stat decreasedStat)
        {
            Name = name;
            Identifier = identifier;
            IncreasedStat = increasedStat;
            DecreasedStat = decreasedStat;
        }
    }
}
