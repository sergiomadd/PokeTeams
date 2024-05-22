using api.Util;

namespace api.DTOs
{
    public class TagDTO
    {
        public string Name { get; set; }
        public string? Identifier { get; set; }
        public string? Description { get; set; }
        public string? Color { get; set; }

        public string? Icon { get; set; }

        public TagDTO(string name, string identifier, string? description = null, string? color = null, string? icon = null)
        {
            Name = name;
            Icon = Checker.CheckIfFileExist(icon) ? icon : null;
            Identifier = identifier;
            Description = description;
            Color = color;
        }
    }
}
