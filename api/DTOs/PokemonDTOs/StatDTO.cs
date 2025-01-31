namespace api.DTOs.PokemonDTOs
{
    public class StatDTO
    {
        public string? Identifier { get; set; }
        public LocalizedText? Name { get; set; }
        public int? Value { get; set; }
        public StatDTO(string? identifier, LocalizedText? name, int? value)
        {
            Identifier = identifier;
            Name = name;
            Value = value;
        }
    }
}
