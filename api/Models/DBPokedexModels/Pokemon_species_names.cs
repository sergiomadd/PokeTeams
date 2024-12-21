using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBModels
{
    [PrimaryKey(nameof(pokemon_species_id), nameof(local_language_id), nameof(name))]

    public class Pokemon_species_names
    {
        [Key]
        [Column(Order = 1)]
        public int pokemon_species_id { get; set; }
        [Key]
        [Column(Order = 2)]
        public int local_language_id { get; set; }
        [Key]
        [Column(Order = 3)]
        public string name { get; set; }
    }
}
