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
    public class NatureServiceTest
    {
        private readonly IConfiguration _configuration;
        private readonly PokedexContext _dbContext;
        private readonly PokedexExpectedResults? _expectedResults;
        private readonly INatureService _service;

        public NatureServiceTest()
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

            //sut
            _service = new NatureService(_dbContext);
        }

        [Theory]
        [InlineData("bold", (int)Lang.en)]
        [InlineData("bold", (int)Lang.es)]
        public async Task GetNatureByIdentifier_ReturnsItemDTO(string identifier, int langId)
        {
            //Arrange
            NatureDTO? expectedNature = ExpectedResults.GetTestNature(langId, _expectedResults);

            //Act
            var result = await _service.GetNatureByIdentifier(identifier, langId);

            //Assert
            expectedNature.Should().NotBeNull();
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedNature);
        }

        [Theory]
        [InlineData("bol", (int)Lang.en)]
        public async Task GetNatureByIdentifier_ReturnsNull(string identifier, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetNatureByIdentifier(identifier, langId);

            //Assert
            result.Should().BeNull();
        }

        [Theory]
        [InlineData("Bold", (int)Lang.en)]
        [InlineData("Bold", (int)Lang.es)]
        [InlineData("Osada", (int)Lang.en)]
        [InlineData("Osada", (int)Lang.es)]
        public async Task GetNatureByName_ReturnsNatureDTO(string name, int langId)
        {
            //Arrange
            NatureDTO? expectedNature = ExpectedResults.GetTestNature(langId, _expectedResults);

            //Act
            var result = await _service.GetNatureByName(name, langId);

            //Assert
            expectedNature.Should().NotBeNull();
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedNature);
        }

        [Theory]
        [InlineData("Bol", (int)Lang.en)]
        [InlineData("Osad", (int)Lang.es)]
        public async Task GetNatureByName_ReturnsNull(string identifier, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetNatureByName(identifier, langId);

            //Assert
            result.Should().BeNull();
        }

        [Theory]
        [InlineData((int)Lang.en, 25)]
        [InlineData((int)Lang.es, 25)]
        public async Task GetAllNatures_ReturnsCount(int langId, int count)
        {
            //Arrange

            //Act
            var result = await _service.GetAllNatures(langId);

            //Assert
            result.Should().NotBeNullOrEmpty();
            result.Should().HaveCount(count);
            result.Should().AllBeOfType<NatureDTO>();
        }

        [Theory]
        [InlineData("m", (int)Lang.en)]
        [InlineData("m", (int)Lang.es)]
        public async Task QueryNaturesByName_ReturnsQueryResultList(string key, int langId)
        {
            //Arrange
            List<QueryResultDTO>? expectedQueryResult = ExpectedResults.GetTestNatureQuery(langId, _expectedResults);

            //Act
            var result = await _service.QueryNaturesByName(key, langId);

            //Assert
            expectedQueryResult.Should().NotBeNullOrEmpty();
            result.Should().NotBeNullOrEmpty();
            result.Should().BeEquivalentTo(expectedQueryResult);
        }

        [Theory]
        [InlineData("mey", (int)Lang.en)]
        [InlineData("muie", (int)Lang.es)]
        public async Task QueryNaturesByName_ReturnsEmptyList(string key, int langId)
        {
            //Arrange

            //Act
            var result = await _service.QueryNaturesByName(key, langId);

            //Assert
            result.Should().NotBeNull();
            result.Should().BeEmpty();
        }

        [Theory]
        [InlineData((int)Lang.en, 25)]
        [InlineData((int)Lang.es, 25)]
        public async Task QueryAllNatures_ReturnsCount(int langId, int count)
        {
            //Arrange

            //Act
            var result = await _service.QueryAllNatures(langId);

            //Assert
            result.Should().NotBeNullOrEmpty();
            result.Should().HaveCount(count);
            result.Should().AllBeOfType<QueryResultDTO>();
        }
    }
}
