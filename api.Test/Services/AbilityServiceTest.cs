using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models;
using api.Services.PokedexServices;
using api.Test.Data;
using api.Test.Integration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace api.Test.Services
{
    public class AbilityServiceTest
    {
        private readonly IConfiguration _configuration;
        private readonly PokedexContext _dbContext;
        private readonly PokedexExpectedResults? _expectedResults;
        private readonly IAbilityService _service;

        public AbilityServiceTest()
        {
            //dependencies
            _configuration = new ConfigurationBuilder().AddUserSecrets<Program>().Build();
            var connectionString = _configuration["ConnectionStrings:SQLServerPokedex"];
            var options = new DbContextOptionsBuilder<PokedexContext>().UseSqlServer(connectionString).Options;
            _dbContext = new PokedexContext(options);

            PokedexExpectedResults? input = ExpectedResults.TryGetPokedexExpectedResults();
            if (input != null)
            {
                _expectedResults = input;
            }

            //sut
            _service = new AbilityService(_dbContext);
        }

        [Theory]
        [InlineData("stench", (int)Lang.en)]
        [InlineData("stench", (int)Lang.es)]
        public async Task GetAbilityByIdentifier_ReturnsItemDTO(string identifier, int langId)
        {
            //Arrange
            AbilityDTO? expectedAbility = ExpectedResults.GetTestAbility(langId, _expectedResults);

            //Act
            var result = await _service.GetAbilityByIdentifier(identifier, langId);

            //Assert
            Assert.NotNull(expectedAbility);
            Assert.NotNull(result);
            var obj1Str = ExpectedResults.GetSerializedObject(expectedAbility);
            var obj2Str = ExpectedResults.GetSerializedObject(result);
            Assert.Equal(obj1Str, obj2Str);
        }

        [Theory]
        [InlineData("sten", (int)Lang.en)]
        public async Task GetAbilityByIdentifier_ReturnsNull(string identifier, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetAbilityByIdentifier(identifier, langId);

            //Assert
            Assert.Null(result);
        }

        [Theory]
        [InlineData("Stench", (int)Lang.en)]
        [InlineData("Stench", (int)Lang.es)]
        [InlineData("Hedor", (int)Lang.en)]
        [InlineData("Hedor", (int)Lang.es)]
        public async Task GetAbilityByName_ReturnsAbilityDTO(string identifier, int langId)
        {
            //Arrange
            AbilityDTO? expectedAbility = ExpectedResults.GetTestAbility(langId, _expectedResults);

            //Act
            var result = await _service.GetAbilityByName(identifier, langId);

            //Assert
            Assert.NotNull(expectedAbility);
            Assert.NotNull(result);
            var obj1Str = ExpectedResults.GetSerializedObject(expectedAbility);
            var obj2Str = ExpectedResults.GetSerializedObject(result);
            Assert.Equal(obj1Str, obj2Str);
        }

        [Theory]
        [InlineData("Sten", (int)Lang.en)]
        [InlineData("Hed", (int)Lang.es)]
        public async Task GetAbilityByName_ReturnsNull(string identifier, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetAbilityByName(identifier, langId);

            //Assert
            Assert.Null(result);
        }

        [Theory]
        [InlineData("chlorophyll", 1)]
        [InlineData("solar-power", 4)]
        public async Task IsAbilityPokemonHiddenAbility_ReturnsTrue(string abilityIdentifier, int dexNumber)
        {
            //Arrange

            //Act
            var result = await _service.IsAbilityPokemonHiddenAbility(abilityIdentifier, dexNumber);

            //Assert
            Assert.True(result);
        }

        [Theory]
        [InlineData("overgrow", 1)]
        [InlineData("harvest", 1)]
        [InlineData("blaze", 4)]
        [InlineData("swarm", 4)]
        public async Task IsAbilityPokemonHiddenAbility_ReturnsFalse(string abilityIdentifier, int dexNumber)
        {
            //Arrange

            //Act
            var result = await _service.IsAbilityPokemonHiddenAbility(abilityIdentifier, dexNumber);

            //Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("pu", (int)Lang.en)]
        [InlineData("pu", (int)Lang.es)]
        public async Task QueryAbilitiesByName_ReturnsQueryResultList(string key, int langId)
        {
            //Arrange
            List<QueryResultDTO>? expectedQueryResult = ExpectedResults.GetTestAbilityQuery(langId, _expectedResults);

            //Act
            var result = await _service.QueryAbilitiesByName(key, langId);

            //Assert
            Assert.NotNull(expectedQueryResult);
            Assert.NotEmpty(expectedQueryResult);
            Assert.NotNull(result);
            Assert.NotEmpty(result);
            Assert.Equivalent(expectedQueryResult, result);
        }

        [Theory]
        [InlineData("Awaketui", (int)Lang.en)]
        [InlineData("Despeertyr", (int)Lang.es)]
        public async Task QueryAbilitiesByName_ReturnsEmptyList(string key, int langId)
        {
            //Arrange

            //Act
            var result = await _service.QueryAbilitiesByName(key, langId);

            //Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Theory]
        [InlineData((int)Lang.en, 367)]
        [InlineData((int)Lang.es, 367)]
        public async Task QueryAllAbilities_ReturnsCount(int langId, int count)
        {
            //Arrange

            //Act
            var result = await _service.QueryAllAbilities(langId);

            //Assert
            Assert.NotNull(result);
            Assert.NotEmpty(result);
            Assert.Equal(count, result.Count);
            Assert.True(result.All(i => i is QueryResultDTO));
        }

        [Theory]
        [InlineData("1", (int)Lang.en)]
        [InlineData("1", (int)Lang.es)]
        public async Task QueryAllPokemonAbilites_ReturnsQueryResultList(string id, int langId)
        {
            //Arrange
            List<QueryResultDTO>? expectedQueryResult = ExpectedResults.GetTestPokemonAbilityQuery(langId, _expectedResults);

            //Act
            var result = await _service.QueryAllPokemonAbilites(id, langId);

            //Assert
            Assert.NotNull(expectedQueryResult);
            Assert.NotEmpty(expectedQueryResult);
            Assert.NotNull(result);
            Assert.NotEmpty(result);
            Assert.Equivalent(expectedQueryResult, result);
        }

        [Theory]
        [InlineData("55555", (int)Lang.en)]
        [InlineData("asdf", (int)Lang.es)]
        public async Task QueryAllPokemonAbilites_ReturnsEmptyList(string id, int langId)
        {
            //Arrange

            //Act
            var result = await _service.QueryAllPokemonAbilites(id, langId);

            //Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }
    }
}
