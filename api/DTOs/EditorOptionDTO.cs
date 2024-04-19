namespace api.DTOs
{
    public class EditorOptionDTO
    {
        public string Name { get; set; }
        public string Identifier { get; set; }
        public string Path { get; set; }
        public EditorOptionDTO(string name, string identifier, string path)
        {
            Name = name;
            Identifier = identifier;
            Path = path;
        }

    }
}
