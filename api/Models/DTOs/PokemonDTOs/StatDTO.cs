namespace api.Models.DTOs.PokemonDTOs
{
    public class StatDTO
    {
        public string? Identifier { get; set; }
        public string? Name { get; set; }
        public int? Value { get; set; }
        public StatDTO(string? identifier, string? name, int? value)
        {
            Identifier = identifier;
            Name = name;
            Value = value;
        }
    }
}
