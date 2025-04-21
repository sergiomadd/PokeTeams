using api.Util;

namespace api.Models
{
    public class LocalizedText
    {
        public string? Content { get; set; }
        public string Language { get; set; }

        public LocalizedText()
        {

        }

        public LocalizedText(string? content, int? languageId = 9)
        {
            Content = content;
            Language =  Converter.GetLangCodeFromID(languageId != null ? (int)languageId : 9);
        }
    }
}
