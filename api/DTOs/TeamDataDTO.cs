using api.DTOs.PokemonDTOs;
using api.Models.DBPoketeamModels;
using System.Text.Json;

namespace api.DTOs
{
    public class TeamDataDTO
    {
        public string ID { get; set; }
        public List<int> PokemonIDs { get; set; }
        public TeamOptionsDTO Options { get; set; }
        public UserPreviewDTO Player { get; set; }
        public TournamentDTO Tournament { get; set; }
        public RegulationDTO Regulation { get; set; }
        public string RentalCode { get; set; }
        public int ViewCount { get; set; }
        public string Date { get; set; }
        public bool Visibility { get; set; }
        public List<TagDTO> Tags { get; set; }

        public TeamDataDTO(string id, List<int> pokemonIDs, string options, UserPreviewDTO player, TournamentDTO tournament, RegulationDTO regulation, string rentalCode, int viewCount, string date, bool visibility, List<TagDTO> tags)
        {
            ID = id;
            PokemonIDs = pokemonIDs;
            Options = JsonSerializer.Deserialize<TeamOptionsDTO>(options, new JsonSerializerOptions { IncludeFields = false });
            Player = player;
            Tournament = tournament;
            Regulation = regulation;
            RentalCode = rentalCode;
            ViewCount = viewCount;
            Date = date;
            Visibility = visibility;
            Tags = tags;
        }
    }
}
