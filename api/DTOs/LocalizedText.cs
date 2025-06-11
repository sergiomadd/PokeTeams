using api.Util;

namespace api.DTOs
{
    public class LocalizedText
    {
        public string? Content { get; set; }
        public string? Language { get; set; }
        public string? Identifier { get; set; }

        public LocalizedText()
        {

        }

        public LocalizedText(string? content, int? languageId = 9, string? identifier = null)
        {
            Content = content;
            Language =  Converter.GetLangCodeFromID(languageId != null ? (int)languageId : 9);
            Identifier = identifier;
        }
    }
}
