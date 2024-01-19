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
        public string Uploaded { get; set; }
        public string Designed { get; set; }


        public TeamDTO()
        {

        }

        public TeamDTO(
            string id,
            List<Pokemon> pokemons,
            string options,
            string uploaded = null,
            string designed = null
            )
        {
            ID = id;
            Pokemons = pokemons;
            Options = JsonSerializer.Deserialize<EditorOptions>(options, new JsonSerializerOptions { IncludeFields = false });
            Uploaded = uploaded;
            Designed = designed;
        }
    }
}
