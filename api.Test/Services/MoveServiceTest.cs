using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models;
using api.Services.PokedexServices;
using api.Test.Data;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .Build();

            var connectionString = _configuration.GetConnectionString("SQLServerPokedex");
            var options = new DbContextOptionsBuilder<PokedexContext>().UseSqlServer(connectionString).Options;
            _dbContext = new PokedexContext(options);

            PokedexExpectedResults? input = ExpectedResults.TryGetPokedexExpectedResults();
            if (input != null)
            {
                _expectedResults = input;
            }

            _typeService = new TypeService(_dbContext);

            //sut
            _service = new MoveService(_dbContext, _typeService);
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
            expectedMove.Should().NotBeNull();
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedMove);
        }

        [Theory]
        [InlineData("aerial-a", (int)Lang.en)]
        public async Task GetMoveByIdentifier_ReturnsNull(string identifier, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetMoveByIdentifier(identifier, langId);

            //Assert
            result.Should().BeNull();
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
            expectedMove.Should().NotBeNull();
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedMove);
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
            result.Should().BeNull();
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
            expectedMove.Should().NotBeNull();
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedMove);
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
            result.Should().BeNull();
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
            expectedQueryResult.Should().NotBeNullOrEmpty();
            result.Should().NotBeNullOrEmpty();
            result.Should().BeEquivalentTo(expectedQueryResult);
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
            result.Should().NotBeNull();
            result.Should().BeEmpty();
        }
    }
}
