using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPokedexModels
{
    public class Abilities
    {
        [Key]
        public int id { get; set; }
        public string identifier { get; set; }
    }
}
