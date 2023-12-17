using api.Models;
using System;
using System.Reflection.Metadata;
using System.Text.RegularExpressions;

namespace api.Services
{
    public static class Util
    {
        public static string FormatProse(string value, string[]? args = null)
        {
            //"https://bulbapedia.bulbagarden.net/wiki/Water_Absorb_(Ability)"
            string formated = value;
            //Regex example: [freeze]{mechanic:freeze}
            string linkRegex = new Regex(@"(\[.+?})").ToString();
            if (Regex.IsMatch(value, linkRegex))
            {
                Match match = Regex.Match(value, linkRegex);
                while (match.Success)
                {
                    formated = formated.Replace(match.Groups[1].Value, InsertLink(match.Groups[1].Value));
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

            return formated;
        }

        private static string InsertLink(string originalValue)
        {
            //cases where the data category comes as "mechanic"
            //but the bulbapedia url doesnt use (status_condition)
            List<string> weather = new List<string>() { "weather", "fog", "harsh-sunlight", "strong-sunlight", "rain", "shadowy-aura", "snow", "strong-winds" };
            List<string> misc = new List<string>() { "power", "pp", "accuracy", "priority", "critical-hit" };
            List<string> weatherConditions = new List<string>() { "hail", "sandstorm" };
            List<string> stats = new List<string>() { "hp", "attack", "defense", "special-attack", "special-defense", "speed", "evasion" };
            List<string> damage = new List<string>() { "regular-damage", "super-effective", "not-very-effective" };

            string wikiStart = "https://bulbapedia.bulbagarden.net/wiki/";
            string typeStart = "https://localhost:7134/images/sprites/types/generation-viii/";
            //string pokemonStart = "https://localhost:7134/images/sprites/pokemon/";
            string category = originalValue.Split(':')[0].Split('{')[1];
            string originalName = originalValue.Split(':')[1].Split('}')[0];
            string formatedName = FormatNameForLink(originalName);
            string formatedCategory = "";
            string end = "";
            string link = "";

            switch (category)
            {
                case "pokemon":
                    formatedCategory = "_(Pokémon)"; //maybe change this for pokemon icon?
                    end = formatedName + formatedCategory;
                    break;
                case "type":
                    end = originalName + ".png";
                    link = typeStart + end;
                    return originalValue[1] == ']' ? originalValue.Insert(1, link) : ReplaceFirst(originalValue, originalName, link);
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
                    if (weatherConditions.Contains(originalName)) { formatedCategory = "_(weather_condition)"; }

                    end = formatedName + formatedCategory;

                    if (weather.Contains(originalName) || misc.Contains(originalName)) { end = formatedName; }
                    if (stats.Contains(originalName)) 
                    {
                        formatedCategory = "Stat#";
                        end = formatedCategory + formatedName;
                        link = wikiStart + end;
                        return originalValue[1] == ']' ? originalValue.Insert(1, link) : ReplaceFirst(originalValue, formatedName, link);
                    }
                    if (damage.Contains(originalName)) { end = "Type#Type_effectiveness"; }
                    if (originalName.Equals("stat-modifier") || originalName.Equals("stage")) { end = "Stat_modifier#In-battle_modification"; }
                    if (originalName.Equals("stat-modifier")) { end = "Stat_modifier#In-battle_modification"; }
                    break;
            }

            link = wikiStart + end;
            return originalValue[1] == ']' ? originalValue.Insert(1, link) : ReplaceFirst(originalValue, originalName, link);
        }

        public static string FormatNameForLink(string name)
        {
            string[] words = name.Split("-");
            if(words.Count() > 1)
            {
                for(var i=0; i<words.Length;i++)
                {
                    words[i] = FirstLetterToUpper(words[i]);
                }
                return String.Join("_", words).Replace(' ', '_');
            }
            else
            {
                return FirstLetterToUpper(name.Replace(' ', '_'));
            }
        }

        public static string FirstLetterToUpper(string str)
        {
            if (str == null)
                return null;

            if (str.Length > 1)
                return char.ToUpper(str[0]) + str.Substring(1);

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
    }
}
