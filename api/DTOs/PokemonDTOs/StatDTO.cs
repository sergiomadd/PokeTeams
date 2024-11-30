namespace api.DTOs.PokemonDTOs
{
    public class StatDTO
    {
        public string? Identifier { get; set; }
        public string? Name { get; set; }
        public int? Value { get; set; }
        public StatDTO(string? identifier, string? name, int? value)
        {
            Identifier = identifier != null ? StatIdentifierConverter[identifier] : identifier;
            Name = name;
            Value = value;
        }

        public Dictionary<string, string> StatIdentifierConverter = new Dictionary<string, string>
        {
            { "hp", "hp" },
            { "attack", "atk" },
            { "defense", "def" },
            { "special-attack", "spa" },
            { "special-defense", "spd" },
            { "speed", "spe" },
        };
    }
}
