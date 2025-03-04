namespace api.DTOs.PokemonDTOs
{
    public class NatureDTO
    {
        public LocalizedText Name { get; set; }
        public string Identifier { get; set; }
        public string IncreasedStatIdentifier { get; set; }
        public string DecreasedStatIdentifier { get; set; }

        public NatureDTO(LocalizedText name, string identifier, string increasedStat, string decreasedStat)
        {
            Name = name;
            Identifier = identifier;
            IncreasedStatIdentifier = increasedStat;
            DecreasedStatIdentifier = decreasedStat;
        }
    }
}
