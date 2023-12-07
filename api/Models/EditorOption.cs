namespace api.Models
{
    public class EditorOption
    {
        public string Name { get; set; }
        public string Identifier { get; set; }
        public string Path { get; set; }
        public EditorOption(string name, string identifier, string path)
        {
            Name = name;
            Identifier = identifier;
            Path = path;
        }

    }
}
