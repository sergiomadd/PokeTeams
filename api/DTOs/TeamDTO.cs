using api.DTOs.PokemonDTOs;

namespace api.DTOs
{
    public class TeamDTO
    {
        public string ID { get; set; }
        public List<PokemonDTO?>? Pokemons { get; set; }
        public UserPreviewDTO? Player { get; set; }
        public TournamentDTO? Tournament { get; set; }
        public RegulationDTO? Regulation { get; set; }
        public string? RentalCode { get; set; }
        public int ViewCount { get; set; }
        public string? Date { get; set; }
        public bool Visibility { get; set; }
        public List<TagDTO>? Tags { get; set; }
        public TeamOptionsDTO? Options { get; set; }


        public TeamDTO()
        {

        }

        public TeamDTO(
            string id,
            List<PokemonDTO> pokemons,
            UserPreviewDTO? player,
            TournamentDTO? tournament,
            RegulationDTO? regulation,
            string? rentalCode,
            int viewCount,
            string? date,
            bool visibility,
            List<TagDTO> tags,
            TeamOptionsDTO? options = null
            )
        {
            ID = id;
            Pokemons = pokemons;
            Options = options;
            Player = player;
            Tournament = tournament;
            Regulation = regulation;
            RentalCode = rentalCode;
            ViewCount = viewCount;
            Date = date;
            Visibility = visibility;
            Tags = tags;
        }

        public TeamDTO(
            TeamDataDTO teamData,
            List<PokemonDTO> pokemons
            )
        {
            ID = teamData.ID;
            Pokemons = pokemons;
            Options = teamData.Options;
            Player = teamData.Player;
            Tournament = teamData.Tournament;
            Regulation = teamData.Regulation;
            RentalCode = teamData.RentalCode;
            ViewCount = teamData.ViewCount;
            Date = teamData.Date;
            Visibility = teamData.Visibility;
            Tags = teamData.Tags;
        }
    }
}
