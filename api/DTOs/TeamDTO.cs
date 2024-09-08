using api.DTOs.PokemonDTOs;
using System.Text.Json;

namespace api.DTOs
{
    public class TeamDTO
    {
        public string ID { get; set; }
        public List<PokemonDTO> Pokemons { get; set; }
        public TeamOptionsDTO? Options { get; set; }
        public UserPreviewDTO? Player { get; set; }
        public TournamentDTO? Tournament { get; set; }
        public RegulationDTO? Regulation { get; set; }
        public int ViewCount { get; set; }
        public string? Date { get; set; }
        public bool Visibility { get; set; }
        public List<TagDTO>? Tags { get; set; }


        public TeamDTO()
        {

        }

        public TeamDTO(
            string id,
            List<PokemonDTO> pokemons,
            string options,
            UserPreviewDTO player,
            TournamentDTO tournament,
            RegulationDTO regulation,
            int viewCount,
            string date,
            bool visibility,
            List<TagDTO> tags
            )
        {
            ID = id;
            Pokemons = pokemons;
            Options = JsonSerializer.Deserialize<TeamOptionsDTO>(options, new JsonSerializerOptions { IncludeFields = false });
            Player = player;
            Tournament = tournament;
            Regulation = regulation;
            ViewCount = viewCount;
            Date = date;
            Visibility = visibility;
            Tags = tags;
        }
    }
}
