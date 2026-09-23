using api.DTOs;
using api.Models.DBPoketeamModels;

namespace api.Test.Models.DBPoketeamModels
{
    public class TournamentTest
    {
        [Fact]
        public void Constructor_ShortNameProvided_UsesProvidedShortName()
        {
            //Arrange
            var tournamentDTO = new TournamentDTO
            {
                Name = "Latin America Regional Championship 2024",
                ShortName = "LARC"
            };

            //Act
            var tournament = new Tournament(tournamentDTO);

            //Assert
            Assert.Equal("LARC", tournament.ShortName);
        }

        [Fact]
        public void Constructor_ShortNameMissing_DerivesShortNameFromName()
        {
            //Arrange
            var tournamentDTO = new TournamentDTO
            {
                Name = "Latin America Regional Championship 2024",
                ShortName = null!
            };

            //Act
            var tournament = new Tournament(tournamentDTO);

            //Assert
            Assert.Equal("Latin America RC 2024", tournament.ShortName);
        }
    }
}
