namespace api.Models
{
    public class LocalizedText
    {
        public string Content { get; set; }
        public string Language { get; set; }

        public LocalizedText(string content, string language = "en") 
        {
            Content = content;
            Language = language;
        }
    }
}
