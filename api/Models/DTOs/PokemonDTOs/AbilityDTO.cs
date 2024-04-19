namespace api.Models.DTOs.PokemonDTOs
{
    public class AbilityDTO
    {
        public string Identifier { get; set; }
        public string Name { get; set; }
        public string Prose { get; set; }

        public AbilityDTO(string identifier, string name, string prose)
        {
            Identifier = identifier;
            Name = name;
            Prose = prose;
        }
    }
}
