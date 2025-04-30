using api.Util;

namespace api.DTOs
{
    public class TagDTO
    {
        public string Name { get; set; }
        public string Identifier { get; set; }
        public string? Description { get; set; }
        public int? Color { get; set; }

        public TagDTO(string name, string identifier, string? description = null, int? color = null)
        {
            Name = name;
            Identifier = identifier;
            Description = description;
            Color = color;
        }
    }
}
