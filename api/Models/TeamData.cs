using Microsoft.AspNetCore.Components.Forms;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Text.Json;

namespace api.Models
{
    public class TeamData
    {
        public List<Pokemon> Pokemons { get; set; }
        public EditorOptions? Options { get; set; }

        public TeamData()
        {

        }

        public TeamData(List<Pokemon> pokemons, string options) 
        {
            Pokemons = pokemons;
            Options = JsonSerializer.Deserialize<EditorOptions>(options, new JsonSerializerOptions { IncludeFields = false });
        }

        /*
        public Object Deserialize(string json, object type)
        {
            var options = new JsonSerializerOptions { IncludeFields = false };
            var obj = JsonSerializer.Deserialize(json, type.GetType(), options);
            return obj;
        }
        */
        /*
        public Pokemon DeserializePokemon()
        {
            var options = new JsonSerializerOptions { IncludeFields = false };
            var obj = JsonSerializer.Deserialize<type>(json, options);
        }
        */
    }
}
