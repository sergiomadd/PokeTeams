using api.DTOs.PokemonDTOs;

namespace api.DTOs
{
    public class TeamPreviewDTO
    {
        public string ID { get; set; }
        public List<int> PokemonIDs { get; set; }
        public UserPreviewDTO? Player { get; set; }
        public UserPreviewDTO? User { get; set; }
        public TournamentDTO? Tournament { get; set; }
        public RegulationDTO? Regulation { get; set; }
        public int ViewCount { get; set; }
        public string? Date { get; set; }
        public bool Visibility { get; set; }
        public List<TagDTO>? Tags { get; set; }
    }
}
