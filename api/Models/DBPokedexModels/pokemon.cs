using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPokedexModels
{
    public class pokemon
    {
        [Key]
        public int id { get; set; }
        public string identifier { get; set; }
        public int species_id { get; set; }
    }
}
