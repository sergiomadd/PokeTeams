using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBModels
{
    [Keyless]
    public class Pokemon_species_names
    {
        public int pokemon_species_id { get; set; }
        public int local_language_id { get; set; }
        public string name { get; set; }
    }
}
