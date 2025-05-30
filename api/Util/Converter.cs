﻿namespace api.Util
{
    public static class Converter
    {
        private static Dictionary<int, string> langs = new Dictionary<int, string>
        {
            { 1, "ja" },
            { 2, "ja" },
            { 3, "ko" },
            { 4, "zh" },
            { 5, "fr" },
            { 6, "de" },
            { 7, "es" },
            { 8, "it" },
            { 9, "en" },
            { 10, "cs" },
            { 11, "ja" },
            { 12, "zh" },
            { 13, "pt" }
        };

        /*
            1  ja = japanese,
            2  ja = romanji //not used
            3  ko = korean
            4  zh = chinese
            5  fr = french
            6  de = deutch
            7  es = spanish
            8  it = italian
            9  en = english   
            10 cs =  // not used
            11 ja = ??
            12 zh = ??
            13 pt = portuguese //not used
        */

        public static int? GetLangIDFromHttpContext(HttpContext context)
        {
            if(context.Request.GetTypedHeaders().AcceptLanguage == null || !context.Request.GetTypedHeaders().AcceptLanguage.Any())
            {
                return null;
            }
            var requestLangs = context.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            string code = requestLangs[0].Value.ToString();

            if (langs.ContainsValue(code))
            {
                return langs.FirstOrDefault(x => x.Value == code).Key;
            }
            return null;
        }

        public static string GetLangCodeFromID(int id)
        {
            if(langs.ContainsKey(id))
            {
                return langs[id];
            }
            return "en";
        }

        public static int? GetLangIDFromCode(string code)
        {
            if (langs.ContainsValue(code))
            {
                return langs.FirstOrDefault(x => x.Value == code).Key;
            }
            return null;
        }
    }
}
