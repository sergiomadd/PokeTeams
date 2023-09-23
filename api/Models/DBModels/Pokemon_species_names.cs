using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    public class Pokemon_species_names
    {
        public int pokemon_species_id { get; set; }
        public int local_language_id { get; set; }
        [Key]
        public string? name { get; set; }
    }
}
