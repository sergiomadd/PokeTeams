namespace api.DTOs.PokemonDTOs
{
    public class AbilityDTO
    {
        public string Identifier { get; set; }
        public LocalizedText Name { get; set; }
        public LocalizedText Prose { get; set; }
        public AbilityDTO(string identifier, LocalizedText name, LocalizedText prose)
        {
            Identifier = identifier;
            Name = name;
            Prose = prose;
        }
    }
}
