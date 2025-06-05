using api.DTOs.PokemonDTOs;
using api.Models.DBPoketeamModels;
using System.Text.Json;

namespace api.DTOs
{
    public class TeamDataDTO
    {
        public string ID { get; set; }
        public List<int> PokemonIDs { get; set; }
        public UserPreviewDTO? Player { get; set; }
        public UserPreviewDTO? User { get; set; }
        public TournamentDTO? Tournament { get; set; }
        public RegulationDTO? Regulation { get; set; }
        public string? RentalCode { get; set; }
        public int ViewCount { get; set; }
        public string Date { get; set; }
        public bool Visibility { get; set; }
        public List<TagDTO> Tags { get; set; }
        public TeamOptionsDTO? Options { get; set; }


        public TeamDataDTO(
            string id, 
            List<int> pokemonIDs, 
            UserPreviewDTO? player,
            UserPreviewDTO? user,
            TournamentDTO? tournament, 
            RegulationDTO? regulation, 
            string? rentalCode, 
            int viewCount, 
            string date, 
            bool visibility, 
            List<TagDTO> tags,
            TeamOptionsDTO? options = null)
        {
            ID = id;
            PokemonIDs = pokemonIDs;
            Player = player;
            User = user;
            Tournament = tournament;
            Regulation = regulation;
            RentalCode = rentalCode;
            ViewCount = viewCount;
            Date = date;
            Visibility = visibility;
            Tags = tags;
            Options = options;
        }
    }
}
