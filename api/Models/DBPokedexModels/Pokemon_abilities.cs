using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPokedexModels
{
    [Keyless]
    public class pokemon_abilities
    {
        public int pokemon_id { get; set; }
        public int ability_id { get; set; }
        public bool is_hidden { get; set; }
    }
}
