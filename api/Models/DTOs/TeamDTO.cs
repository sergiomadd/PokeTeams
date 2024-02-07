using Microsoft.AspNetCore.Components.Forms;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Text.Json;

namespace api.Models.DTOs
{
    public class TeamDTO
    {
        public string ID { get; set; }
        public List<Pokemon> Pokemons { get; set; }
        public EditorOptions? Options { get; set; }
        public string? Player { get; set; }
        public string? Tournament { get; set; }
        public string? Regulation { get; set; }
        public int ViewCount { get; set; }
        public string? Date { get; set; }
        public bool Visibility { get; set; }


        public TeamDTO()
        {

        }

        public TeamDTO(
            string id,
            List<Pokemon> pokemons,
            string options,
            string uploaded,
            string tournament,
            string regulation,
            int viewCount,
            string date,
            bool visibility
            )
        {
            ID = id;
            Pokemons = pokemons;
            Options = JsonSerializer.Deserialize<EditorOptions>(options, new JsonSerializerOptions { IncludeFields = false });
            Player = uploaded;
            Tournament = tournament;
            Regulation = regulation;
            ViewCount = viewCount;
            Date = date;
            Visibility = visibility;
        }
    }
}
