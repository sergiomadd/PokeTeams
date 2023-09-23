namespace api.Models
{
    public class Nature
    {
        public string Name { get; set; }
        public string IncreasedStat { get; set; }
        public string DecreasedStat { get; set; }

        public Nature(string name, string increasedStat, string decreasedStat)
        {
            Name = name;
            IncreasedStat = increasedStat;
            DecreasedStat = decreasedStat;
        }
    }
}
