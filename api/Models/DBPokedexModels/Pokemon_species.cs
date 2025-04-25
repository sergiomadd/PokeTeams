using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    public class pokemon_species
    {
        [Key]
        public int id { get; set; }
        public string identifier { get; set; }
        public int? evolves_from_species_id { get; set; }
    }
}
