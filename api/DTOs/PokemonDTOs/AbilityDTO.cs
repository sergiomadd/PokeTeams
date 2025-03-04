namespace api.DTOs.PokemonDTOs
{
    public class AbilityDTO
    {
        public string Identifier { get; set; }
        public LocalizedText? Name { get; set; }
        public LocalizedText? Prose { get; set; }
        public bool Hidden { get; set; } 
        public AbilityDTO(string identifier, LocalizedText? name, LocalizedText? prose, bool hidden = false)
        {
            Identifier = identifier;
            Name = name;
            Prose = prose;
            Hidden = hidden;
        }
    }
}
