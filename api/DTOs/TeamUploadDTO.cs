using api.DTOs.PokemonDTOs;
using System.Text.Json;

namespace api.DTOs
{
    public class TeamUploadDTO
    {
        public string ID { get; set; }
        public List<PokemonDTO> Pokemons { get; set; }
        public EditorOptionsDTO? Options { get; set; }
        public string? Player { get; set; }
        public string? Tournament { get; set; }
        public string? Regulation { get; set; }
        public int ViewCount { get; set; }
        public string? Date { get; set; }
        public bool Visibility { get; set; }
        public List<TagDTO>? Tags { get; set; }


        public TeamUploadDTO()
        {

        }

        public TeamUploadDTO(
            string id,
            List<PokemonDTO> pokemons,
            string options,
            string uploaded,
            string tournament,
            string regulation,
            int viewCount,
            string date,
            bool visibility,
            List<TagDTO> tags
            )
        {
            ID = id;
            Pokemons = pokemons;
            Options = JsonSerializer.Deserialize<EditorOptionsDTO>(options, new JsonSerializerOptions { IncludeFields = false });
            Player = uploaded;
            Tournament = tournament;
            Regulation = regulation;
            ViewCount = viewCount;
            Date = date;
            Visibility = visibility;
            Tags = tags;
        }
    }
}
