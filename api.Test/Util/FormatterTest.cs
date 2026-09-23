using api.Util;

namespace api.Test.Util
{
    public class FormatterTest
    {
        [Theory]
        [InlineData("Latin America Regional Championship 2024", "Latin America RC 2024")]
        [InlineData("Latin America Regional Championships 2024", "Latin America RC 2024")]
        [InlineData("North America International Championships", "North America IC")]
        [InlineData("North America International Championship", "North America IC")]
        [InlineData("latin america regional championship", "latin america RC")]
        public void DeriveShortName_ReplacesChampionshipSuffix_WithAcronym(string name, string expected)
        {
            //Act
            var shortName = Formatter.DeriveShortName(name);

            //Assert
            Assert.Equal(expected, shortName);
        }

        [Fact]
        public void DeriveShortName_NoChampionshipSuffix_ReturnsNameUnchanged()
        {
            //Arrange
            var name = "Players Cup";

            //Act
            var shortName = Formatter.DeriveShortName(name);

            //Assert
            Assert.Equal(name, shortName);
        }
    }
}
