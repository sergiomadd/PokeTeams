namespace api.Models
{
    public class Nature
    {
        public string Name { get; set; }
        public Stat IncreasedStat { get; set; }
        public Stat DecreasedStat { get; set; }

        public Nature(string name, Stat increasedStat, Stat decreasedStat)
        {
            Name = name;
            IncreasedStat = increasedStat;
            DecreasedStat = decreasedStat;
        }
    }
}
