using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models;
using api.Util;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace api.Test.Data
{
    public static class ExpectedResults
    {
        private static readonly Printer Printer = new Printer(LoggerFactory.Create(builder =>
        {
            builder
                .AddConsole()
                .AddDebug()
                .SetMinimumLevel(LogLevel.Debug);
        }).CreateLogger<Printer>());

        public static string GetSerializedObject(object obj)
        {
            return JsonConvert.SerializeObject(obj).Replace("\\r\\n", "").Replace("\\r", "").Replace("\\n", "");
        }

        public static PokedexExpectedResults? TryGetPokedexExpectedResults()
        {
            try
            {
                string filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "pokedexCases.json");
                string json = File.ReadAllText(filePath);
                return JsonConvert.DeserializeObject<PokedexExpectedResults>(json);
            }
            catch (Exception e)
            {
                Printer.Log("Error loading test expectedResults.json", e);
            }
            return null;
        }

        public static ItemDTO? GetTestItem(int langId, PokedexExpectedResults? expected)
        {
            try
            {
                switch (langId)
                {
                    case (int)Lang.es:
                        return expected.es.itemCases.DTO1.result.ToObject<ItemDTO>();
                    default:
                        return expected.en.itemCases.DTO1.result.ToObject<ItemDTO>();
                }
            }
            catch (Exception e)
            {
                Printer.Log("Exception in test data getter: ", e);
            }
            return null;

        }

        public static List<QueryResultDTO>? GetTestItemQuery(int langId, PokedexExpectedResults? expected)
        {
            try
            {
                switch (langId)
                {
                    case (int)Lang.es:
                        return expected.es.itemCases.query1.queryResult.ToObject<List<QueryResultDTO>>();
                    default:
                        return expected.en.itemCases.query1.queryResult.ToObject<List<QueryResultDTO>>();
                }
            }
            catch (Exception e)
            {
                Printer.Log("Exception in test data getter: ", e);
            }
            return null;
        }

        public static AbilityDTO? GetTestAbility(int langId, PokedexExpectedResults? expected)
        {
            try
            {
                switch (langId)
                {
                    case (int)Lang.es:
                        return expected.es.abilityCases.DTO1.result.ToObject<AbilityDTO>();
                    default:
                        return expected.en.abilityCases.DTO1.result.ToObject<AbilityDTO>();
                }
            }
            catch (Exception e)
            {
                Printer.Log("Exception in test data getter: ", e);
            }
            return null;
        }

        public static List<QueryResultDTO>? GetTestAbilityQuery(int langId, PokedexExpectedResults? expected)
        {
            try
            {
                switch (langId)
                {
                    case (int)Lang.es:
                        return expected.es.abilityCases.query1.queryResult.ToObject<List<QueryResultDTO>>();
                    default:
                        return expected.en.abilityCases.query1.queryResult.ToObject<List<QueryResultDTO>>();
                }
            }
            catch (Exception e)
            {
                Printer.Log("Exception in test data getter: ", e);
            }
            return null;
        }

        public static List<QueryResultDTO>? GetTestPokemonAbilityQuery(int langId, PokedexExpectedResults? expected)
        {
            try
            {
                switch (langId)
                {
                    case (int)Lang.es:
                        return expected.es.abilityCases.query2.queryResult.ToObject<List<QueryResultDTO>>();
                    default:
                        return expected.en.abilityCases.query2.queryResult.ToObject<List<QueryResultDTO>>();
                }
            }
            catch (Exception e)
            {
                Printer.Log("Exception in test data getter: ", e);
            }
            return null;
        }

        public static MoveDTO? GetTestMove(int langId, PokedexExpectedResults? expected)
        {
            try
            {
                switch (langId)
                {
                    case (int)Lang.es:
                        return expected.es.moveCases.DTO1.result.ToObject<MoveDTO>();
                    default:
                        return expected.en.moveCases.DTO1.result.ToObject<MoveDTO>();
                }
            }
            catch (Exception e)
            {
                Printer.Log("Exception in test data getter: ", e);
            }
            return null;
        }

        public static MovePreviewDTO? GetTestMovePreview(int langId, PokedexExpectedResults? expected)
        {
            try
            {
                switch (langId)
                {
                    case (int)Lang.es:
                        return expected.es.moveCases.DTO2.result.ToObject<MovePreviewDTO>();
                    default:
                        return expected.en.moveCases.DTO2.result.ToObject<MovePreviewDTO>();
                }
            }
            catch (Exception e)
            {
                Printer.Log("Exception in test data getter: ", e);
            }
            return null;
        }

        public static List<QueryResultDTO>? GetTestMoveQuery(int langId, PokedexExpectedResults? expected)
        {
            try
            {
                switch (langId)
                {
                    case (int)Lang.es:
                        return expected.es.moveCases.query1.queryResult.ToObject<List<QueryResultDTO>>();
                    default:
                        return expected.en.moveCases.query1.queryResult.ToObject<List<QueryResultDTO>>();
                }
            }
            catch (Exception e)
            {
                Printer.Log("Exception in test data getter: ", e);
            }
            return null;
        }

        public static NatureDTO? GetTestNature(int langId, PokedexExpectedResults? expected)
        {
            try
            {
                switch (langId)
                {
                    case (int)Lang.es:
                        return expected.es.natureCases.DTO1.result.ToObject<NatureDTO>();
                    default:
                        return expected.en.natureCases.DTO1.result.ToObject<NatureDTO>();
                }
            }
            catch (Exception e)
            {
                Printer.Log("Exception in test data getter: ", e);
            }
            return null;
        }

        public static List<QueryResultDTO>? GetTestNatureQuery(int langId, PokedexExpectedResults? expected)
        {
            try
            {
                switch (langId)
                {
                    case (int)Lang.es:
                        return expected.es.natureCases.query1.queryResult.ToObject<List<QueryResultDTO>>();
                    default:
                        return expected.en.natureCases.query1.queryResult.ToObject<List<QueryResultDTO>>();
                }
            }
            catch (Exception e)
            {
                Printer.Log("Exception in test data getter: ", e);
            }
            return null;
        }

        public static PokeTypeDTO? GetTestType(int langId, PokedexExpectedResults? expected)
        {
            try
            {
                switch (langId)
                {
                    case (int)Lang.es:
                        return expected.es.typeCases.DTO1.result.ToObject<PokeTypeDTO>();
                    default:
                        return expected.en.typeCases.DTO1.result.ToObject<PokeTypeDTO>();
                }
            }
            catch (Exception e)
            {
                Printer.Log("Exception in test data getter: ", e);
            }
            return null;
        }

        public static PokeTypeWithEffectivenessDTO? GetTestTypeWithEffectiveness(int langId, PokedexExpectedResults? expected)
        {
            try
            {
                switch (langId)
                {
                    case (int)Lang.es:
                        return expected.es.typeCases.DTO2.result.ToObject<PokeTypeWithEffectivenessDTO>();
                    default:
                        return expected.en.typeCases.DTO2.result.ToObject<PokeTypeWithEffectivenessDTO>();
                }
            }
            catch (Exception e)
            {
                Printer.Log("Exception in test data getter: ", e);
            }
            return null;
        }

        public static PokeTypesDTO? GetTestPokemonTypes(int langId, PokedexExpectedResults? expected)
        {
            try
            {
                switch (langId)
                {
                    case (int)Lang.es:
                        return expected.es.typeCases.DTO3.result.ToObject<PokeTypesDTO>();
                    default:
                        return expected.en.typeCases.DTO3.result.ToObject<PokeTypesDTO>();
                }
            }
            catch (Exception e)
            {
                Printer.Log("Exception in test data getter: ", e);
            }
            return null;
        }

        public static PokeTypesWithEffectivenessDTO? GetTestPokemonTypesWithEffectiveness(int langId, PokedexExpectedResults? expected)
        {
            try
            {
                switch (langId)
                {
                    case (int)Lang.es:
                        return expected.es.typeCases.DTO4.result.ToObject<PokeTypesWithEffectivenessDTO>();
                    default:
                        return expected.en.typeCases.DTO4.result.ToObject<PokeTypesWithEffectivenessDTO>();
                }
            }
            catch (Exception e)
            {
                Printer.Log("Exception in test data getter: ", e);
            }
            return null;
        }

        public static List<QueryResultDTO>? GetTestTypeQuery(int langId, PokedexExpectedResults? expected)
        {
            try
            {
                switch (langId)
                {
                    case (int)Lang.es:
                        return expected.es.typeCases.query1.queryResult.ToObject<List<QueryResultDTO>>();
                    default:
                        return expected.en.typeCases.query1.queryResult.ToObject<List<QueryResultDTO>>();
                }
            }
            catch (Exception e)
            {
                Printer.Log("Exception in test data getter: ", e);
            }
            return null;
        }
    }
}
