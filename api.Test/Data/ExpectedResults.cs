using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models;
using api.Util;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api.Test.Data
{
    public static class ExpectedResults
    {
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

        public static ItemDTO? GetTestItem(int langId, PokedexExpectedResults expected)
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

        public static List<QueryResultDTO>? GetTestItemQuery(int langId, PokedexExpectedResults expected)
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

        public static AbilityDTO? GetTestAbility(int langId, PokedexExpectedResults expected)
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

        public static MoveDTO? GetTestMove(int langId, PokedexExpectedResults expected)
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

        public static NatureDTO? GetTestNature(int langId, PokedexExpectedResults expected)
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

        public static PokeTypeDTO? GetTestType(int langId, PokedexExpectedResults expected)
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
    }
}
