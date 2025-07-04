using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace api.Util
{
    public static class Formatter
    {

        public static string? FormatProse(string? value, string baseUrl, string?[]? args = null)
        {
            string? formated = value;
            if(value != null)
            {
                //Regex example: [paralyzed]{mechanic:paralysis}
                string linkRegex = new Regex(@"(\[.+?})").ToString();
                if (Regex.IsMatch(value, linkRegex))
                {
                    Match match = Regex.Match(value, linkRegex);
                    while (match.Success)
                    {
                        formated = formated.Replace(match.Groups[1].Value, InsertLink(match.Groups[1].Value, baseUrl));
                        match = match.NextMatch();
                    }
                }
                if (args != null && args.Count() > 0)
                {
                    //Regex example: $effect_chance% 
                    string effectChanceRegex = new Regex(@"(\$.*?%)").ToString();
                    if (Regex.IsMatch(value, effectChanceRegex))
                    {
                        Match match = Regex.Match(value, effectChanceRegex);
                        while (match.Success)
                        {
                            formated = formated.Replace(match.Groups[1].Value, args[0] + '%');
                            match = match.NextMatch();
                        }
                    }
                }
            }

            return formated;
        }

        private static string InsertLink(string originalValue, string baseUrl)
        {
            //cases where the data category comes as "mechanic"
            //but the bulbapedia url doesnt use (status_condition)

            List<string> weather = new List<string>() { "weather", "fog", "harsh-sunlight", "strong-sunlight", "rain", "shadowy-aura", "snow", "strong-winds" };
            List<string> misc = new List<string>() { "power", "pp", "accuracy", "priority", "critical-hit" };
            List<string> weatherConditions = new List<string>() { "hail", "sandstorm" };
            List<string> stats = new List<string>() { "hp", "attack", "defense", "special-attack", "special-defense", "speed", "evasion" };
            List<string> damage = new List<string>() { "regular-damage", "super-effective", "not-very-effective" };

            string wikiStart = "https://bulbapedia.bulbagarden.net/wiki/";
            string typeStart = $"{baseUrl}images/types/";
            //string pokemonStart = $"{baseUrl}images/pokemon/";

            //Original: [paralyzed]{mechanic:paralysis} -> [originalName]{categoryType:categoryName}
            //Output:   [originalName](path){categoryType:categoryName}

            string originalName = originalValue.Split('[')[1].Split(']')[0];
            string categoryType = originalValue.Split(':')[0].Split('{')[1];
            string categoryName = originalValue.Split(':')[1].Split('}')[0];
            string formatedName = FormatNameForLink(categoryName);
            string formatedCategory = "";
            string end = "";
            string link = "";
            string result = "";

            if (originalName.Equals(""))
            {
                originalName = categoryName;
            }

            //Swith to make link for bulbapedia
            //Format: "https://bulbapedia.bulbagarden.net/wiki/Water_Absorb_(Ability)"
            switch (categoryType)
            {
                case "pokemon":
                    formatedCategory = "_(Pokémon)"; //maybe change this for pokemon icon?
                    end = formatedName + formatedCategory;
                    break;
                case "type":
                    end = originalName + ".png";
                    link = typeStart + end;
                    result = "[" + originalName + "]" + "(" + link + ")" + "{" + categoryType + "}";
                    return result;
                case "move":
                    formatedCategory = "_(move)";
                    end = formatedName + formatedCategory;
                    break;
                case "ability":
                    formatedCategory = "_(Ability)";
                    end = formatedName + formatedCategory;
                    break;
                case "mechanic":
                    formatedCategory = "_(status_condition)";
                    if (weatherConditions.Contains(categoryName)) { formatedCategory = "_(weather_condition)"; }

                    end = formatedName + formatedCategory;

                    if (weather.Contains(categoryName) || misc.Contains(categoryName)) { end = formatedName; }
                    if (stats.Contains(categoryName))
                    {
                        formatedCategory = "Stat#";
                        end = formatedCategory + formatedName;
                        link = wikiStart + end;
                        result = "[" + originalName + "]" + "(" + link + ")" + "{" + categoryType + "}";
                        return result;
                    }
                    if (damage.Contains(categoryName)) 
                    {
                        return originalName; 
                    }
                    if (categoryName.Equals("stat-modifier") || categoryName.Equals("stage")) { end = "Stat_modifier#In-battle_modification"; }
                    if (categoryName.Equals("stat-modifier")) { end = "Stat_modifier#In-battle_modification"; }
                    break;
            }

            link = wikiStart + end;
            result = "[" + originalName + "]" + "(" + link + ")" + "{" + categoryType + "}";
            return result;
        }

        public static string? FormatNameForLink(string name)
        {
            string[] words = name.Split("-");
            if (words.Count() > 1)
            {
                for (var i = 0; i < words.Length; i++)
                {
                    words[i] = FirstLetterToUpper(words[i]);
                }
                return string.Join("_", words).Replace(' ', '_');
            }
            else
            {
                return FirstLetterToUpper(name.Replace(' ', '_'));
            }
        }

        public static string FirstLetterToUpper(string? str)
        {
            if (str == null)
            {
                return str;
            }
            if (str.Length > 1)
            {
                return char.ToUpper(str[0]) + str.Substring(1);
            }
            return str.ToUpper();
        }

        public static string ReplaceFirst(string text, string search, string replace)
        {
            int pos = text.IndexOf(search);
            if (pos < 0)
            {
                return text;
            }
            return text.Substring(0, pos) + replace + text.Substring(pos + search.Length);
        }

        public static string NormalizeString(string text)
        {
            return text.ToUpperInvariant();
        }

        public static string CapitalizeFirst(string text)
        {
            string firstCapitalized = text.Substring(0, 1).ToUpper();
            string rest = text.Substring(1, text.Length - 1);
            return firstCapitalized + rest;
        }

        public static bool IsNullOrEmpty<T>(this IEnumerable<T> value)
        {
            return value == null || !value.Any();
        }

        public static string RemoveDiacritics(string input)
        {
            string normalized = input.Normalize(NormalizationForm.FormD);
            StringBuilder builder = new StringBuilder();

            foreach (char c in normalized)
            {
                if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                {
                    builder.Append(c);
                }
            }

            return builder.ToString();
        }
    }
}
