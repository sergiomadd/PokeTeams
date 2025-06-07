using Newtonsoft.Json.Linq;

namespace api.Test.Data
{
    public class PokedexExpectedResults
    {
        public LocalizedCase en { get; set; }
        public LocalizedCase es { get; set; }

    }

    public class LocalizedCase
    {
        public CaseCategory itemCases { get; set; }
        public CaseCategory abilityCases { get; set; }
        public CaseCategory moveCases { get; set; }
        public CaseCategory natureCases { get; set; }
        public CaseCategory typeCases { get; set; }
    }

    public class CaseCategory
    {
        public Case DTO1 { get; set; }
        public Case? DTO2 { get; set; }
        public Case? DTO3 { get; set; }
        public Case? DTO4 { get; set; }
        public QueryCase? query1 { get; set; }
        public QueryCase? query2 { get; set; }
        public QueryCase? query3 { get; set; }
        public QueryCase? query4 { get; set; }
    }

    public class Case
    {
        public JValue identifier { get; set; }
        public JObject result { get; set; }
    }

    public class QueryCase
    {
        public JValue identifier { get; set; }
        public JArray queryResult { get; set; }
    }
}
