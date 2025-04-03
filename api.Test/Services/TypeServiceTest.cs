using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models;
using api.Services.PokedexServices;
using api.Test.Data;
using api.Test.Integration;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace api.Test.Services
{
    public class TypeServiceTest
    {
        private readonly IConfiguration _configuration;
        private readonly PokedexContext _dbContext;
        private readonly PokedexExpectedResults? _expectedResults;
        private readonly ITypeService _service;

        public TypeServiceTest()
        {
            //dependencies
            _configuration = new ConfigurationBuilder().AddUserSecrets<AppInstance>().Build();
            var connectionString = _configuration["ConnectionStrings:SQLServerPokedex"];
            var options = new DbContextOptionsBuilder<PokedexContext>().UseSqlServer(connectionString).Options;
            _dbContext = new PokedexContext(options);

            PokedexExpectedResults? input = ExpectedResults.TryGetPokedexExpectedResults();
            if (input != null)
            {
                _expectedResults = input;
            }

            //sut
            _service = new TypeService(_dbContext);
        }

        [Theory]
        [InlineData(8, (int)Lang.en)]
        [InlineData(8, (int)Lang.es)]
        public async Task GetTypeById_ReturnsPokeTypeDTO(int id, int langId)
        {
            //Arrange
            PokeTypeDTO? expectedType = ExpectedResults.GetTestType(langId, _expectedResults);

            //Act
            var result = await _service.GetTypeById(id, langId);

            //Assert
            expectedType.Should().NotBeNull();
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedType);
        }

        [Theory]
        [InlineData(50, (int)Lang.en)]
        public async Task GetTypeById_ReturnsNull(int id, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetTypeById(id, langId);

            //Assert
            result.Should().BeNull();
        }

        [Theory]
        [InlineData("ghost", (int)Lang.en)]
        [InlineData("ghost", (int)Lang.es)]
        public async Task GetTypeByIdentifier_ReturnsPokeTypeDTO(string name, int langId)
        {
            //Arrange
            PokeTypeDTO expectedType = ExpectedResults.GetTestType(langId, _expectedResults);

            //Act
            var result = await _service.GetTypeByIdentifier(name, false, langId);

            //Assert
            expectedType.Should().NotBeNull();
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedType);
        }

        [Theory]
        [InlineData("ghosty", (int)Lang.en)]
        [InlineData("ghosty", (int)Lang.es)]
        public async Task GetTypeByIdentifier_ReturnsNull(string identifier, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetTypeByIdentifier(identifier, false, langId);

            //Assert
            result.Should().BeNull();
        }

        [Theory]
        [InlineData(8, (int)Lang.en)]
        [InlineData(8, (int)Lang.es)]
        public async Task GetTypeWithEffectivenessById_ReturnsPokeTypeWithEffectivenessDTO(int id, int langId)
        {
            //Arrange
            PokeTypeWithEffectivenessDTO? expectedTypeWithEffectiveness = ExpectedResults.GetTestTypeWithEffectiveness(langId, _expectedResults);

            //Act
            var result = await _service.GetTypeWithEffectivenessById(id, langId);

            //Assert
            expectedTypeWithEffectiveness.Should().NotBeNull();
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedTypeWithEffectiveness);
        }

        [Theory]
        [InlineData(50, (int)Lang.en)]
        public async Task GetTypeWithEffectivenessById_ReturnsNull(int id, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetTypeWithEffectivenessById(id, langId);

            //Assert
            result.Should().BeNull();
        }

        [Theory]
        [InlineData("ghost", (int)Lang.en)]
        [InlineData("ghost", (int)Lang.es)]
        public async Task GetTypeWithEffectivenessByIdentifier_ReturnsPokeTypeWithEffectivenessDTO(string name, int langId)
        {
            //Arrange
            PokeTypeWithEffectivenessDTO? expectedTypeWithEffectiveness = ExpectedResults.GetTestTypeWithEffectiveness(langId, _expectedResults);

            //Act
            var result = await _service.GetTypeWithEffectivenessByIdentifier(name, langId);

            //Assert
            expectedTypeWithEffectiveness.Should().NotBeNull();
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedTypeWithEffectiveness);
        }

        [Theory]
        [InlineData("ghosty", (int)Lang.en)]
        [InlineData("ghosty", (int)Lang.es)]
        public async Task GetTypeWithEffectivenessByIdentifier_ReturnsNull(string identifier, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetTypeWithEffectivenessByIdentifier(identifier, langId);

            //Assert
            result.Should().BeNull();
        }

        [Theory]
        [InlineData(8, (int)Lang.en)]
        [InlineData(8, (int)Lang.es)]
        public async Task GetTypeEffectivenessAttack_ReturnsPokeTypeWithEffectivenessDTO(int id, int langId)
        {
            //Arrange
            PokeTypeWithEffectivenessDTO? expectedTypeWithEffectiveness = ExpectedResults.GetTestTypeWithEffectiveness(langId, _expectedResults);
            EffectivenessDTO? expectedAttackEffectiveness = null;
            if(expectedTypeWithEffectiveness != null)
            {
                expectedAttackEffectiveness = expectedTypeWithEffectiveness.EffectivenessAttack;
            }

            //Act
            var result = await _service.GetTypeEffectivenessAttack(id, langId);

            //Assert
            expectedAttackEffectiveness.Should().NotBeNull();
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedAttackEffectiveness);
        }

        [Theory]
        [InlineData(50, (int)Lang.en)]
        public async Task GetTypeEffectivenessAttack_ReturnsNull(int id, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetTypeEffectivenessAttack(id, langId);

            //Assert
            result.Should().BeNull();
        }

        [Theory]
        [InlineData(8, (int)Lang.en)]
        [InlineData(8, (int)Lang.es)]
        public async Task GetTypeEffectivenessDefense_ReturnsPokeTypeWithEffectivenessDTO(int id, int langId)
        {
            //Arrange
            PokeTypeWithEffectivenessDTO? expectedTypeWithEffectiveness = ExpectedResults.GetTestTypeWithEffectiveness(langId, _expectedResults);
            EffectivenessDTO? expectedDefenseEffectiveness = null;
            if (expectedTypeWithEffectiveness != null)
            {
                expectedDefenseEffectiveness = expectedTypeWithEffectiveness.EffectivenessDefense;
            }

            //Act
            var result = await _service.GetTypeEffectivenessDefense(id, langId);

            //Assert
            expectedDefenseEffectiveness.Should().NotBeNull();
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedDefenseEffectiveness);
        }

        [Theory]
        [InlineData(50, (int)Lang.en)]
        public async Task GetTypeEffectivenessDefense_ReturnsNull(int id, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetTypeEffectivenessDefense(id, langId);

            //Assert
            result.Should().BeNull();
        }

        [Theory]
        [InlineData(7, (int)Lang.en)]
        [InlineData(7, (int)Lang.es)]
        public async Task GetPokemonTypes_ReturnsPokeTypesDTO(int id, int langId)
        {
            //Arrange
            PokeTypesDTO? expectedTypes = ExpectedResults.GetTestPokemonTypes(langId, _expectedResults);

            //Act
            var result = await _service.GetPokemonTypes(id, langId);

            //Assert
            expectedTypes.Should().NotBeNull();
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedTypes);
        }

        [Theory]
        [InlineData(99999, (int)Lang.en)]
        [InlineData(99999, (int)Lang.es)]
        public async Task GetPokemonTypes_ReturnsNull(int id, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetPokemonTypes(id, langId);

            //Assert
            result.Should().BeNull();
        }

        [Theory]
        [InlineData(7, (int)Lang.en)]
        [InlineData(7, (int)Lang.es)]
        public async Task GetPokemonTypesWithEffectiveness_ReturnsPokeTypesWithEffectivenessDTO(int id, int langId)
        {
            //Arrange
            PokeTypesWithEffectivenessDTO? expectedTypesWithEffectiveness = ExpectedResults.GetTestPokemonTypesWithEffectiveness(langId, _expectedResults);

            //Act
            var result = await _service.GetPokemonTypesWithEffectiveness(id, langId);

            //Assert
            expectedTypesWithEffectiveness.Should().NotBeNull();
            result.Should().NotBeNull();
            result.Should().BeEquivalentTo(expectedTypesWithEffectiveness);
        }

        [Theory]
        [InlineData(999999, (int)Lang.en)]
        [InlineData(999999, (int)Lang.es)]
        public async Task GetPokemonTypesWithEffectiveness_ReturnsNull(int id, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetPokemonTypesWithEffectiveness(id, langId);

            //Assert
            result.Should().BeNull();
        }

        [Theory]
        [InlineData((int)Lang.en, 18)]
        [InlineData((int)Lang.es, 18)]
        public async Task GetAllTypes_ReturnsCount(int langId, int count)
        {
            //Arrange

            //Act
            var result = await _service.GetAllTypes(langId);

            //Assert
            result.Should().NotBeNullOrEmpty();
            result.Should().HaveCount(count);
            result.Should().AllBeOfType<PokeTypeDTO>();
            result.Should().AllSatisfy(t => t.Teratype.Should().Be(false));
        }

        [Theory]
        [InlineData((int)Lang.en, 18)]
        [InlineData((int)Lang.es, 18)]
        public async Task GetAllTeraTypes_ReturnsCount(int langId, int count)
        {
            //Arrange

            //Act
            var result = await _service.GetAllTeraTypes(langId);

            //Assert
            result.Should().NotBeNullOrEmpty();
            result.Should().HaveCount(count);
            result.Should().AllBeOfType<PokeTypeDTO>();
            result.Should().AllSatisfy(t => t.Teratype.Should().Be(true));
        }

        [Theory]
        [InlineData("w", (int)Lang.en)]
        [InlineData("a", (int)Lang.es)]
        public async Task QueryTypesByName_ReturnsQueryResultList(string key, int langId)
        {
            //Arrange
            List<QueryResultDTO>? expectedQueryResult = ExpectedResults.GetTestTypeQuery(langId, _expectedResults);

            //Act
            var result = await _service.QueryTypesByName(key, langId);

            //Assert
            expectedQueryResult.Should().NotBeNullOrEmpty();
            result.Should().NotBeNullOrEmpty();
            result.Should().BeEquivalentTo(expectedQueryResult);
        }

        [Theory]
        [InlineData("Watery", (int)Lang.en)]
        [InlineData("Aquatico", (int)Lang.es)]
        public async Task QueryTypesByName_ReturnsEmptyList(string key, int langId)
        {
            //Arrange

            //Act
            var result = await _service.QueryTypesByName(key, langId);

            //Assert
            result.Should().NotBeNull();
            result.Should().BeEmpty();
        }

        [Theory]
        [InlineData((int)Lang.en, 18)]
        [InlineData((int)Lang.es, 18)]
        public async Task QueryAllTeraTypes_ReturnsCount(int langId, int count)
        {
            //Arrange

            //Act
            var result = await _service.QueryAllTeraTypes(langId);

            //Assert
            result.Should().NotBeNullOrEmpty();
            result.Should().HaveCount(count);
            result.Should().AllBeOfType<QueryResultDTO>();
        }
    }
}
