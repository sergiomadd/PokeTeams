using api.Models.DBPokedexModels;
using LinqKit;

namespace api.Util
{
    public static class PokemonEdgeCasesHandler
    {
        public static string? HandleFallbackNameEdgeCases(int? pokemonId, string? formIdentifier)
        {
            if (pokemonId != null)
            {
                if (PokemonIdToShowdownName.ContainsKey((int)pokemonId))
                {
                    return PokemonIdToShowdownName.GetValueOrDefault((int)pokemonId);
                }
                else if (formIdentifier != null)
                {
                    var nameWords = formIdentifier.Split("-").ToList();
                    var capitalizedNameWords = nameWords.Select(CapitalizeFirstLetter);
                    return string.Join("-", capitalizedNameWords);
                }
            }
            return formIdentifier;
        }

        public static string? HandleFormNameEdgeCases(string? pokemonName, string? formName)
        {
            string? composedName = pokemonName + " " + formName;
            var nameWords = composedName.Split(" ");
            if(composedName.Contains("-"))
            {
                nameWords = composedName.Split(new[] { '-', ' ' }, StringSplitOptions.RemoveEmptyEntries);
            }
            var composedNameWords = nameWords.Distinct().ToList();
            composedName = string.Join(" ", composedNameWords);
            return composedName;
        }

        public static List<pokemon> HandleExcludedForms(List<pokemon> pokemonList)
        {
            pokemonList.RemoveAll(p => ArePokemonFormsExcluded(p.id));
            //If zygarde, non power construct forms (pokemonIds = [718, 10181])
            if (pokemonList.Any(p => p.species_id == 718))
            {
                pokemonList.RemoveAll(p => p.id == 718 || p.id == 10181);
            }
            //If eevee, remove partner eevee
            if (pokemonList.Any(p => p.species_id == 133))
            {
                pokemonList.RemoveAll(p => p.id == 10159);
            }
            return pokemonList;
        }

        //Identifier comes in as lowercase
        public static string HandleFormIdentifierEdgeCases(string identifier)
        {
            //Ogerpon-Cornerstone
            if (identifier.Contains("ogerpon"))
            {
                identifier += "-mask";
            }
            //Tauros-Paldea-Blaze
            if (identifier.Contains("tauros-paldea"))
            {
                identifier += "-breed";
            }
            //Maushold three / maushold four
            //" Maushold-Four" -> ""
            if (identifier.Contains("maushold"))
            {
                if (identifier.Contains("three")) { identifier = "maushold-family-of-three"; }
                if (identifier.Contains("four")) { identifier = "maushold-family-of-four"; }
            }
            /* Female forms that change pokemon identifier
             * "meowstic-female"
             * "indeedee-female"
             * "basculegion-female"
             * "oinkologne-female"
             */
            if (identifier.Contains("(f)") || (identifier.Contains("-f") && identifier.EndsWith("-f")))
            {
                var aux = identifier.Split("-");
                identifier = aux[0] + "-" + "female";
            }

            return identifier;
        }

        public static bool ArePokemonFormsExcluded(int pokemonId)
        {
            return excludedForms.Contains(pokemonId);
        }

        public static bool IsPokemonDefaultForm(int pokeminId)
        {
            return defaultFormPokemons.Contains(pokeminId);
        }

        public static string CapitalizeFirstLetter(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return input;
            }
            return char.ToUpper(input[0]) + input.Substring(1);
        }

        //Matcher for cases were reversing name does not work
        //[pokemonId, Showdown compatible name]
        public static Dictionary<int, string> PokemonIdToShowdownName = new Dictionary<int, string>
        {
            //Tauros forms
            {10250, "Tauros-Paldea-Combat" },
            {10251, "Tauros-Paldea-Blaze" },
            {10252, "Tauros-Paldea-Aqua" },
        };

        //Excluded forms from loading -> too many or irrelevant
        //[pokemonId]
        public static List<int> excludedForms = new List<int>
        { 
            //Pikachu forms
            10080, 10081, 10082, 10083, 10084, 10085, 10094, 10095, 10096, 10097, 10098, 10099, 10148, 10158, 10160,
            //Partner eevee
            10159,
            //Totems
            10093, 10121, 10122, 10128, 10129, 10144, 10145, 10146, 10149, 10150, 10153, 10154,
            //Cramorang
            10182, 10183,
            //Arceus forms
            10041, 10042, 10043, 10044, 10045, 10046, 10047, 10048, 10049, 10050, 10051, 10052, 10053, 10054, 10055, 10056, 10057, 10085,
            //Minior forms
            10130, 10131, 10132, 10133, 10134, 10135, 10136, 10137, 10138, 10139, 10140, 10141, 10142,
            //Morpeko forms
            10187
        };

        //Pokemons where default name is a form name
        //[dexNumber]
        //[Deoxys, Rotom, Basculin, Oricorio, Lycanroc, Ogerpon, Terapagos]
        public static List<int> defaultFormPokemons = new List<int> { 386, 550, 741, 745, 892, 1017, 1024 };
    }
}
