using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models;
using api.Models.DBModels;
using api.Services.PokedexServices;
using api.Test.Data;
using api.Test.Integration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace api.Test.Services
{
    public class ItemServiceTest
    {
        private readonly IConfiguration _configuration;
        private readonly PokedexContext _dbContext;
        private readonly PokedexExpectedResults? _expectedResults;
        private readonly IItemService _service;

        public ItemServiceTest() 
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
            _service = new ItemService(_dbContext);
        }

        [Theory]
        [InlineData("awakening", (int)Lang.en)]
        [InlineData("awakening", (int)Lang.es)]
        public async Task GetItemByIdentifier_ReturnsItemDTO(string identifier, int langId)
        {
            //Arrange
            ItemDTO? expectedItem = ExpectedResults.GetTestItem(langId, _expectedResults);

            //Act
            var result = await _service.GetItemByIdentifier(identifier, langId);

            //Assert
            Assert.NotNull(expectedItem);
            Assert.NotNull(result);
            var obj1Str = ExpectedResults.GetSerializedObject(expectedItem);
            var obj2Str = ExpectedResults.GetSerializedObject(result);
            Assert.Equal(obj1Str, obj2Str);
        }

        [Theory]
        [InlineData("awake", (int)Lang.en)]
        public async Task GetItemByIdentifier_ReturnsNull(string identifier, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetItemByIdentifier(identifier, langId);

            //Assert
            Assert.Null(result);
        }

        [Theory]
        [InlineData("Awakening", (int)Lang.en)]
        [InlineData("Awakening", (int)Lang.es)]
        [InlineData("Despertar", (int)Lang.en)]
        [InlineData("Despertar", (int)Lang.es)]
        public async Task GetItemByName_ReturnsItemDTO(string name, int langId)
        {
            //Arrange
            ItemDTO? expectedItem = ExpectedResults.GetTestItem(langId, _expectedResults);

            //Act
            var result = await _service.GetItemByName(name, langId);

            //Assert
            Assert.NotNull(expectedItem);
            Assert.NotNull(result);
            var obj1Str = ExpectedResults.GetSerializedObject(expectedItem);
            var obj2Str = ExpectedResults.GetSerializedObject(result);
            Assert.Equal(obj1Str, obj2Str);
        }

        [Theory]
        [InlineData("Awake", (int)Lang.en)]
        [InlineData("Desper", (int)Lang.es)]
        public async Task GetItemByName_ReturnsNull(string identifier, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetItemByName(identifier, langId);

            //Assert
            Assert.Null(result);
        }

        [Theory]
        [InlineData("pu", (int)Lang.en)]
        [InlineData("mu", (int)Lang.es)]
        public async Task QueryItemsByName_ReturnsQueryResultList(string key, int langId)
        {
            //Arrange
            List<QueryResultDTO>? expectedQueryResult = ExpectedResults.GetTestItemQuery(langId, _expectedResults);

            //Act
            var result = await _service.QueryItemsByName(key, langId);

            //Assert
            Assert.NotNull(expectedQueryResult);
            Assert.NotEmpty(expectedQueryResult);
            Assert.NotNull(result);
            Assert.NotEmpty(result);
            Assert.Equivalent(expectedQueryResult, result);
        }

        [Theory]
        [InlineData("purt", (int)Lang.en)]
        [InlineData("mumyue", (int)Lang.es)]
        public async Task QueryItemsByName_ReturnsEmptyList(string key, int langId)
        {
            //Arrange

            //Act
            var result = await _service.QueryItemsByName(key, langId);

            //Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }
    }
}
