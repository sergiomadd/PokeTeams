using api.DTOs.PokemonDTOs;

namespace api.DTOs
{
    public class TeamPreviewDTO
    {
        public string ID { get; set; }
        public List<PokemonPreviewDTO> Pokemons { get; set; }
        public EditorOptionsDTO? Options { get; set; }
        public string? Player { get; set; }
        public TournamentDTO? Tournament { get; set; }
        public RegulationDTO? Regulation { get; set; }
        public int ViewCount { get; set; }
        public string? Date { get; set; }
        public bool Visibility { get; set; }
        public List<TagDTO>? Tags { get; set; }
    }
}
