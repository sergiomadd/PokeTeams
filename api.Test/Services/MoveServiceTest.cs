using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models;
using api.Services.PokedexServices;
using api.Test.Data;
using api.Test.Integration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace api.Test.Services
{
    public class MoveServiceTest
    {
        private readonly IConfiguration _configuration;
        private readonly PokedexContext _dbContext;
        private readonly PokedexExpectedResults _expectedResults;
        private readonly IMoveService _service;
        private readonly ITypeService _typeService;

        public MoveServiceTest()
        {
            //dependencies
            _configuration = new ConfigurationBuilder()
                .AddUserSecrets<AppInstance>()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.Test.json", optional: true, reloadOnChange: true)
                .Build();

            var connectionString = _configuration["ConnectionStrings:PostgrePokedex"];
            var options = new DbContextOptionsBuilder<PokedexContext>().UseNpgsql(connectionString).Options;
            _dbContext = new PokedexContext(options);

            PokedexExpectedResults? input = ExpectedResults.TryGetPokedexExpectedResults();
            if (input != null)
            {
                _expectedResults = input;
            }

            _typeService = new TypeService(_dbContext, _configuration);

            //sut
            _service = new MoveService(_dbContext, _typeService, _configuration);
        }

        [Theory]
        [InlineData("aerial-ace", (int)Lang.en)]
        [InlineData("aerial-ace", (int)Lang.es)]
        public async Task GetMoveByIdentifier_ReturnsMoveDTO(string identifier, int langId)
        {
            //Arrange
            MoveDTO? expectedMove = ExpectedResults.GetTestMove(langId, _expectedResults);

            //Act
            var result = await _service.GetMoveByIdentifier(identifier, langId);

            //Assert
            Assert.NotNull(expectedMove);
            Assert.NotNull(result);
            var obj1Str = ExpectedResults.GetSerializedObject(expectedMove);
            var obj2Str = ExpectedResults.GetSerializedObject(result);
            Assert.Equal(obj1Str, obj2Str);
        }

        [Theory]
        [InlineData("aerial-a", (int)Lang.en)]
        public async Task GetMoveByIdentifier_ReturnsNull(string identifier, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetMoveByIdentifier(identifier, langId);

            //Assert
            Assert.Null(result);
        }

        [Theory]
        [InlineData("Aerial Ace", (int)Lang.en)]
        [InlineData("Aerial Ace", (int)Lang.es)]
        [InlineData("Golpe Aéreo", (int)Lang.en)]
        [InlineData("Golpe Aéreo", (int)Lang.es)]
        public async Task GetMoveByName_ReturnsMoveDTO(string name, int langId)
        {
            //Arrange
            MoveDTO? expectedMove = ExpectedResults.GetTestMove(langId, _expectedResults);

            //Act
            var result = await _service.GetMoveByName(name, langId);

            //Assert
            Assert.NotNull(expectedMove);
            Assert.NotNull(result);
            var obj1Str = ExpectedResults.GetSerializedObject(expectedMove);
            var obj2Str = ExpectedResults.GetSerializedObject(result);
            Assert.Equal(obj1Str, obj2Str);
        }

        [Theory]
        [InlineData("Aerial", (int)Lang.en)]
        [InlineData("Golpe A", (int)Lang.es)]
        public async Task GetMoveByName_ReturnsNull(string identifier, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetMoveByName(identifier, langId);

            //Assert
            Assert.Null(result);
        }

        [Theory]
        [InlineData("aerial-ace", (int)Lang.en)]
        [InlineData("aerial-ace", (int)Lang.es)]
        public async Task GetMovePreviewByIdentifier_ReturnsMovePreviewDTO(string name, int langId)
        {
            //Arrange
            MovePreviewDTO? expectedMove = ExpectedResults.GetTestMovePreview(langId, _expectedResults);

            //Act
            var result = await _service.GetMovePreviewByIdentifier(name, langId);

            //Assert
            Assert.NotNull(expectedMove);
            Assert.NotNull(result);
            Assert.Equivalent(expectedMove, result);
        }

        [Theory]
        [InlineData("aerial-a", (int)Lang.en)]
        [InlineData("aerial-a", (int)Lang.es)]
        public async Task GetMovePreviewByIdentifier_ReturnsNull(string identifier, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetMovePreviewByIdentifier(identifier, langId);

            //Assert
            Assert.Null(result);
        }

        [Theory]
        [InlineData("ca", (int)Lang.en)]
        [InlineData("ti", (int)Lang.es)]
        public async Task QueryMovesByName_ReturnsQueryResultList(string key, int langId)
        {
            //Arrange
            List<QueryResultDTO>? expectedQueryResult = ExpectedResults.GetTestMoveQuery(langId, _expectedResults);

            //Act
            var result = await _service.QueryMovesByName(key, langId);

            //Assert
            Assert.NotNull(expectedQueryResult);
            Assert.NotEmpty(expectedQueryResult);
            Assert.NotNull(result);
            Assert.NotEmpty(result);
            Assert.Equivalent(expectedQueryResult, result);
        }

        [Theory]
        [InlineData("catye", (int)Lang.en)]
        [InlineData("muie", (int)Lang.es)]
        public async Task QueryMovesByName_ReturnsEmptyList(string key, int langId)
        {
            //Arrange

            //Act
            var result = await _service.QueryMovesByName(key, langId);

            //Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }
    }
}
