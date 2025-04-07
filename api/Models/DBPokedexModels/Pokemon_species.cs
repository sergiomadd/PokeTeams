using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    [Keyless]
    public class pokemon_species
    {
        public int id { get; set; }
        public int? evolves_from_species_id { get; set; }
    }
}
