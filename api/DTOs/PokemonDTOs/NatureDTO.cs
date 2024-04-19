namespace api.DTOs.PokemonDTOs
{
    public class NatureDTO
    {
        public string Name { get; set; }
        public string Identifier { get; set; }
        public StatDTO IncreasedStat { get; set; }
        public StatDTO DecreasedStat { get; set; }

        public NatureDTO(string name, string identifier, StatDTO increasedStat, StatDTO decreasedStat)
        {
            Name = name;
            Identifier = identifier;
            IncreasedStat = increasedStat;
            DecreasedStat = decreasedStat;
        }
    }
}
