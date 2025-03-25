using api.Util;

namespace api.DTOs
{
    public class TagDTO
    {
        public string Name { get; set; }
        public string Identifier { get; set; }
        public string? Description { get; set; }
        public string? Color { get; set; }

        public TagDTO(string name, string identifier, string? description = null, string? color = null)
        {
            Name = name;
            Identifier = identifier;
            Description = description;
            Color = color;
        }
    }
}
