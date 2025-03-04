using api.Util;

namespace api.Models
{
    public class LocalizedText
    {
        public string? Content { get; set; }
        public string Language { get; set; }

        public LocalizedText(string? content, string? language = "en") 
        {
            Content = content;
            Language = language != null ? language : "en";
        }

        public LocalizedText(string? content, int? languageId = 9)
        {
            Content = content;
            Language = languageId != null ? Converter.GetLangCodeFromID((int)languageId) : "en";
        }
    }
}
