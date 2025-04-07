using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBModels
{
    public class pokemon_species_names
    {
        [Key]
        public int pokemon_species_id { get; set; }
        public int local_language_id { get; set; }
        public string name { get; set; }
    }
}
