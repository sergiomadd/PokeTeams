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
    public class TypeServiceTest
    {
        private readonly IConfiguration _configuration;
        private readonly PokedexContext _dbContext;
        private readonly PokedexExpectedResults? _expectedResults;
        private readonly ITypeService _service;

        public TypeServiceTest()
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

            //sut
            _service = new TypeService(_dbContext, _configuration);
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
            Assert.NotNull(expectedType);
            Assert.NotNull(result);
            Assert.Equivalent(expectedType, result);
        }

        [Theory]
        [InlineData(50, (int)Lang.en)]
        public async Task GetTypeById_ReturnsNull(int id, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetTypeById(id, langId);

            //Assert
            Assert.Null(result);
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
            Assert.NotNull(expectedType);
            Assert.NotNull(result);
            Assert.Equivalent(expectedType, result);
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
            Assert.Null(result);
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
            Assert.NotNull(expectedTypeWithEffectiveness);
            Assert.NotNull(result);
            Assert.Equivalent(expectedTypeWithEffectiveness, result);
        }

        [Theory]
        [InlineData(50, (int)Lang.en)]
        public async Task GetTypeWithEffectivenessById_ReturnsNull(int id, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetTypeWithEffectivenessById(id, langId);

            //Assert
            Assert.Null(result);
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
            Assert.NotNull(expectedTypeWithEffectiveness);
            Assert.NotNull(result);
            var obj1Str = ExpectedResults.GetSerializedObject(expectedTypeWithEffectiveness);
            var obj2Str = ExpectedResults.GetSerializedObject(result);
            Assert.Equal(obj1Str, obj2Str);
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
            Assert.Null(result);
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
            Assert.NotNull(expectedAttackEffectiveness);
            Assert.NotNull(result);
            Assert.Equivalent(expectedAttackEffectiveness, result);
        }

        [Theory]
        [InlineData(50, (int)Lang.en)]
        public async Task GetTypeEffectivenessAttack_ReturnsNull(int id, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetTypeEffectivenessAttack(id, langId);

            //Assert
            Assert.Null(result);
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
            Assert.NotNull(expectedDefenseEffectiveness);
            Assert.NotNull(result);
            Assert.Equivalent(expectedDefenseEffectiveness, result);
        }

        [Theory]
        [InlineData(50, (int)Lang.en)]
        public async Task GetTypeEffectivenessDefense_ReturnsNull(int id, int langId)
        {
            //Arrange

            //Act
            var result = await _service.GetTypeEffectivenessDefense(id, langId);

            //Assert
            Assert.Null(result);
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
            Assert.NotNull(expectedTypes);
            Assert.NotNull(result);
            Assert.Equivalent(expectedTypes, result);
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
            Assert.Null(result);
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
            Assert.NotNull(expectedTypesWithEffectiveness);
            Assert.NotNull(result);
            Assert.Equivalent(expectedTypesWithEffectiveness, result);
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
            Assert.Null(result);
        }

        [Theory]
        [InlineData((int)Lang.en, 19)]
        [InlineData((int)Lang.es, 19)]
        public async Task GetAllTypes_ReturnsCount(int langId, int count)
        {
            //Arrange

            //Act
            var result = await _service.GetAllTypes(langId);

            //Assert
            Assert.NotNull(result);
            Assert.NotEmpty(result);
            Assert.Equal(count, result.Count);
            Assert.True(result.All(i => i is PokeTypeDTO));
            Assert.True(result.All(i => !i.Teratype));
        }

        [Theory]
        [InlineData((int)Lang.en, 19)]
        [InlineData((int)Lang.es, 19)]
        public async Task GetAllTeraTypes_ReturnsCount(int langId, int count)
        {
            //Arrange

            //Act
            var result = await _service.GetAllTeraTypes(langId);

            //Assert
            Assert.NotNull(result);
            Assert.NotEmpty(result);
            Assert.Equal(count, result.Count);
            Assert.True(result.All(i => i is PokeTypeDTO));
            Assert.True(result.All(i => i.Teratype));
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
            Assert.NotNull(expectedQueryResult);
            Assert.NotEmpty(expectedQueryResult);
            Assert.NotNull(result);
            Assert.NotEmpty(result);
            Assert.Equivalent(expectedQueryResult, result);
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
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Theory]
        [InlineData((int)Lang.en, 19)]
        [InlineData((int)Lang.es, 19)]
        public async Task QueryAllTeraTypes_ReturnsCount(int langId, int count)
        {
            //Arrange

            //Act
            var result = await _service.QueryAllTeraTypes(langId);

            //Assert
            Assert.NotNull(result);
            Assert.NotEmpty(result);
            Assert.Equal(count, result.Count);
            Assert.True(result.All(i => i is QueryResultDTO));
        }
    }
}
