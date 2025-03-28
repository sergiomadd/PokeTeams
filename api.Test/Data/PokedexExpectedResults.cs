using api.DTOs;
using api.DTOs.PokemonDTOs;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        public QueryCase query1 { get; set; }
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
