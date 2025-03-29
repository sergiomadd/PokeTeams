using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models;
using api.Models.DBModels;
using api.Services.PokedexServices;
using api.Test.Data;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace api.Test.Services
{
    public class ItemServiceTest
    {
        private readonly IConfiguration _configuration;
        private readonly PokedexContext _dbContext;
        private readonly PokedexExpectedResults _expectedResults;
        private readonly IItemService _service;

        public ItemServiceTest() 
        {
            //dependencies
            _configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .Build();

            var connectionString = _configuration.GetConnectionString("SQLServerPokedex");
            var options = new DbContextOptionsBuilder<PokedexContext>().UseSqlServer(connectionString).Options;
            _dbContext = new PokedexContext(options);

            //Expected results igual mejor sin que sea static, pero deberia ser singleton de alguna manera

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
            expectedItem.Should().NotBeNull();
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedItem);
        }

        [Theory]
        [InlineData("awake", (int)Lang.en)]
        public async Task GetItemByIdentifier_ReturnsNull(string identifier, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetItemByIdentifier(identifier, langId);

            //Assert
            result.Should().BeNull();
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
            expectedItem.Should().NotBeNull();
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedItem);
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
            result.Should().BeNull();
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
            expectedQueryResult.Should().NotBeNullOrEmpty();
            result.Should().NotBeNullOrEmpty();
            result.Should().BeEquivalentTo(expectedQueryResult);
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
            result.Should().NotBeNull();
            result.Should().BeEmpty();
        }
    }
}
