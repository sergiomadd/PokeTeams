using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPokedexModels
{
    [Keyless]
    public class Pokemon_abilities
    {
        
        public int pokemon_id { get; set; }
        public int ability_id { get; set; }
        public int is_hidden { get; set; }
    }
}
