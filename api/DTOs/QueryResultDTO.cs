namespace api.DTOs
{
    public class QueryResultDTO
    {
        public string Name { get; set; }
        public string Identifier { get; set; }
        public string? Icon { get; set; }
        public string? Type { get; set; }

        public QueryResultDTO(string name, string identifier, string? icon = null, string? type = null)
        {
            Name = name;
            Identifier = identifier;
            Icon = icon;
            Type = type;
        }
    }
}
