using api.Models.DBPokedexModels;

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

        public static string? HandleFormNameEdgeCases(int? formId, string? pokemonName, string? formName)
        {
            string? composedName = null;
            if (formId != null)
            {
                if(formIdsWithoutPokemonNameInFormName.Contains((int)formId))
                {
                    composedName = pokemonName + " " + formName;
                    var nameWords = composedName.Split(" ");
                    var composedNameWords = nameWords.Distinct().ToList();
                    composedName = string.Join(" ", composedNameWords);
                }
            }
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
            /* Female forms that change pokemon identifier
             * "meowstic-female"
             * "indeedee-female"
             * "basculegion-female"
             * "oinkologne-female"
             */
            if (identifier.ToLower().Contains("(f)") || identifier.ToLower().Contains("-f"))
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
        public static Dictionary<int, string> PokemonIdToShowdownName = new Dictionary<int, string>
        {
            //Tauros forms
            {10250, "Tauros-Paldea-Combat" },
            {10251, "Tauros-Paldea-Blaze" },
            {10252, "Tauros-Paldea-Aqua" },
        };

        //Excluded forms from loading -> too many or irrelevant
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
            10041, 10042, 10043, 10044, 10045, 10046, 10047, 10048, 10049, 10050, 10051, 10052, 10053, 10054, 10055, 10056, 10057, 10085
        };

        //Pokemons where default name is a form name
        //[Deoxys, Rotom, Basculin, Oricorio, Lycanroc, Ogerpon, Terapagos]
        public static List<int> defaultFormPokemons = new List<int> { 386, 550, 741, 745, 892, 1017, 1024 };

        //Forms where the form name doesnt contain the pokemon name
        public static List<int> formIdsWithoutPokemonNameInFormName = new List<int>
        { 
            //Tauros
            10419, 10420, 10421,

            //Castform
            10028, 10029, 10030,

            //Deoxys forms
            386, 10031, 10032, 10033,

            //Kyogre
            10179,

            //Groudon
            10180,

            //Wormadam
            10036, 10037,

            //Rotom
            10058, 10059, 10060, 10061, 10062,

            //Giratina
            10063,

            //Shaymin
            10064,

            //Basculin
            550, 902, 10066, 10416, 10417,

            //Darmanitan
            10335, 10067, 10336, 10337, 

            //Tornadus
            10079,

            //Thundurus
            10080,

            //Landorous
            10081,

            //Enamorus
            10418,

            //Kyurem
            10082, 10083,

            //Keldeo
            10084,

            //Meloetta
            10074,

            //Greninja
            10218, 10219,

            //Meowstic
            10124,

            //Aegislash
            10125,

            //Zygarde
            10220, 10221, 10222,

            //Hoopa
            10188,

            //Oricorio
            741, 10225, 10226, 10227,

            //Lycanrock
            10310, 10228, 10311,

            //Wishiwashi
            10229,

            //Necrozma
            10314, 10315, 10316,

            //Toxtricity
            10343, 10388, 10397,

            //Eiscue
            10354,

            //Indeedee
            10355,

            //Zacian
            10357,

            //Zamazenta
            10358,

            //Eternatus
            10359,

            //Urshifu
            892, 10360, 10395, 10396,

            //Zarude
            10361,

            //Calyrex
            10362, 10363,

            //Ursaluna
            10441,

            //Oinkologne
            10423,

            //Maushold
            10426,

            //Palafin
            10425,

            //Tatsugiri
            10427, 10428,
            
            //Gimmighoul
            10432,

            //Ogerpon
            1017, 10442, 10443, 10444,
            
            //Terapagos
            1024, 10445, 10446
        };
    }
}
