using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    public class Pokemon_species
    {
        public int id { get; set; }
        public int? evolves_from_species_id { get; set; }
    }
}
